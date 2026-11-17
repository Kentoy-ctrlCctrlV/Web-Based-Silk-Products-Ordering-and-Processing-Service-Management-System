import cors from 'cors';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { UserRole, filterCatalogForRole, isValidOrderTransition } from './domain';
import { createCatalogDraft, findCatalogItemById, getUserByEmail, listAllCatalogForStaff, listPublishedCatalog, updateCatalogStatus } from './store';

dotenv.config();

type AuthenticatedRequest = Request & {
  user?: { sub: string; role: UserRole; email: string };
};

const app = express();
const secret = process.env.JWT_SECRET ?? 'development-secret-do-not-use-in-production';

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'SilkMart API' });
});

app.post('/api/auth/login', (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = getUserByEmail(parsed.data.email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const passwordMatches = bcrypt.compareSync(parsed.data.password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const header = authenticatedReq.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required.' });
  }

  try {
    const token = header.substring(7);
    const payload = jwt.verify(token, secret) as { sub: string; role: UserRole; email: string };
    authenticatedReq.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

app.get('/api/catalog', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role ?? 'customer';
  const catalog = role === 'customer' ? listPublishedCatalog() : listAllCatalogForStaff();
  return res.json(filterCatalogForRole(catalog, role));
});

app.post('/api/catalog', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff or administrator access required.' });
  }

  const schema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    unit: z.string().min(1),
    price: z.number().nullable().optional(),
    availability: z.number().nullable().optional(),
    sourceUrl: z.string().optional(),
    sourceNotes: z.string().optional(),
    priceEvidence: z.string().optional(),
    photoSourceUrl: z.string().optional(),
    photoStatus: z.enum(['official', 'approved', 'unavailable', 'pending_staff_upload']).optional(),
    verifiedBy: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid catalog payload.' });
  }

  const item = createCatalogDraft({
    id: `prod-${Date.now()}`,
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description,
    unit: parsed.data.unit,
    price: parsed.data.price ?? null,
    availability: parsed.data.availability ?? null,
    sourceUrl: parsed.data.sourceUrl ?? '',
    sourceNotes: parsed.data.sourceNotes ?? 'Awaiting verification record.',
    priceVisibility: parsed.data.price !== null ? 'published' : 'contact_ptri',
    priceEvidence: parsed.data.priceEvidence ?? 'Price pending PTRI confirmation.',
    photoStatus: parsed.data.photoStatus ?? 'pending_staff_upload',
    photoSourceUrl: parsed.data.photoSourceUrl ?? '',
    photoRightsStatus: parsed.data.photoSourceUrl ? 'approved' : 'unavailable',
    verifiedBy: parsed.data.verifiedBy ?? '',
    lastUpdatedBy: req.user.email,
    lastUpdatedAt: new Date().toISOString(),
    isPublished: false,
    isArchived: false,
  });

  return res.status(201).json({ message: 'Draft catalog item created.', item });
});

app.post('/api/catalog/:id/publish', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff or administrator access required.' });
  }

  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const item = findCatalogItemById(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Catalog item not found.' });
  }

  const updated = updateCatalogStatus(item.id, 'published', req.user.email);
  return res.json({ message: 'Catalog item published.', item: updated });
});

app.post('/api/catalog/:id/archive', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff or administrator access required.' });
  }

  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const item = findCatalogItemById(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Catalog item not found.' });
  }

  const updated = updateCatalogStatus(item.id, 'archived', req.user.email);
  return res.json({ message: 'Catalog item archived.', item: updated });
});

app.post('/api/orders/transition', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff or administrator access required.' });
  }

  const schema = z.object({ currentStatus: z.string(), nextStatus: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Order state transition is incomplete.' });
  }

  const valid = isValidOrderTransition(parsed.data.currentStatus as any, parsed.data.nextStatus as any);
  return res.json({ valid, message: valid ? 'Transition accepted.' : 'Transition rejected.' });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`SilkMart API running on http://localhost:${port}`);
});
