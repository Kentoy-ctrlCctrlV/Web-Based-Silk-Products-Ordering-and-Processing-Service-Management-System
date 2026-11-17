import bcrypt from 'bcryptjs';
import { demoCredentialUsers, ProductRecord, UserRecord } from './domain';

export const db = {
  users: new Map<string, UserRecord>(),
  catalog: new Map<string, ProductRecord>(),
};

const fixtureUsers: UserRecord[] = [
  {
    id: 'cust-001',
    name: 'Test Customer',
    email: 'customer@demo.com',
    passwordHash: bcrypt.hashSync('customer123', 10),
    role: 'customer',
    phone: '+63 917 000 0000',
    address: 'Cagayan de Oro City',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'staff-001',
    name: 'Staff Reviewer',
    email: 'staff@ptri.demo',
    passwordHash: bcrypt.hashSync('staff123', 10),
    role: 'staff',
    phone: '+63 920 000 0000',
    address: 'Villanueva',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@ptri.demo',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+63 930 000 0000',
    address: 'PTRI HQ',
    createdAt: new Date().toISOString(),
  },
];

for (const user of fixtureUsers) {
  db.users.set(user.email.toLowerCase(), user);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return db.users.get(email.trim().toLowerCase());
}

export function listPublishedCatalog(): ProductRecord[] {
  return Array.from(db.catalog.values())
    .filter((item) => item.isPublished && item.status === 'published' && !item.isArchived)
    .sort((a, b) => (b.lastUpdatedAt > a.lastUpdatedAt ? 1 : -1));
}

export function listAllCatalogForStaff(): ProductRecord[] {
  return Array.from(db.catalog.values())
    .filter((item) => !item.isArchived)
    .sort((a, b) => (b.lastUpdatedAt > a.lastUpdatedAt ? 1 : -1));
}

export function createCatalogDraft(input: Partial<ProductRecord> & { name: string; category: string; description: string; unit: string }): ProductRecord {
  const record: ProductRecord = {
    id: input.id ?? `prod-${Date.now()}`,
    name: input.name,
    category: input.category,
    description: input.description,
    unit: input.unit,
    price: input.price ?? null,
    availability: input.availability ?? null,
    image: input.image ?? null,
    lowStockThreshold: input.lowStockThreshold ?? null,
    status: input.status ?? 'draft',
    sourceUrl: input.sourceUrl ?? '',
    sourceNotes: input.sourceNotes ?? 'Awaiting PTRI verification.',
    priceVisibility: input.priceVisibility ?? 'not_published',
    priceEvidence: input.priceEvidence ?? 'Price pending PTRI confirmation.',
    photoStatus: input.photoStatus ?? 'unavailable',
    photoSourceUrl: input.photoSourceUrl ?? '',
    photoRightsStatus: input.photoRightsStatus ?? 'unavailable',
    verifiedBy: input.verifiedBy ?? '',
    verifiedAt: input.verifiedAt ?? '',
    lastUpdatedBy: input.lastUpdatedBy ?? 'staff reviewer',
    lastUpdatedAt: input.lastUpdatedAt ?? new Date().toISOString(),
    isPublished: false,
    isArchived: false,
  };

  db.catalog.set(record.id, record);
  return record;
}

export function findCatalogItemById(id: string): ProductRecord | undefined {
  return db.catalog.get(id);
}

export function updateCatalogStatus(id: string, nextStatus: ProductRecord['status'], actorName: string): ProductRecord | undefined {
  const current = findCatalogItemById(id);
  if (!current) return undefined;

  const updated: ProductRecord = {
    ...current,
    status: nextStatus,
    isPublished: nextStatus === 'published',
    isArchived: nextStatus === 'archived',
    verifiedBy: current.verifiedBy || actorName,
    verifiedAt: nextStatus === 'published' ? new Date().toISOString() : current.verifiedAt,
    lastUpdatedBy: actorName,
    lastUpdatedAt: new Date().toISOString(),
  };

  db.catalog.set(id, updated);
  return updated;
}

export function getTestUsers(): { email: string; password: string; role: 'customer' | 'staff' | 'admin' }[] {
  return demoCredentialUsers.map((user) => ({ ...user }));
}
