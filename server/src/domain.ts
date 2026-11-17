export type UserRole = 'customer' | 'staff' | 'admin';
export type CatalogStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Ready' | 'Scheduled' | 'Completed' | 'Rejected' | 'Cancelled';
export type PriceVisibility = 'published' | 'contact_ptri' | 'not_published';
export type PhotoStatus = 'official' | 'approved' | 'unavailable' | 'pending_staff_upload';

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  price: number | null;
  availability: number | null;
  image: string | null;
  lowStockThreshold: number | null;
  status: CatalogStatus;
  sourceUrl: string;
  sourceNotes: string;
  priceVisibility: PriceVisibility;
  priceEvidence: string;
  photoStatus: PhotoStatus;
  photoSourceUrl: string;
  photoRightsStatus: PhotoStatus;
  verifiedBy: string;
  verifiedAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  isPublished: boolean;
  isArchived: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone: string;
  address: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  submittedAt: string;
  requestedDeliveryDate: string;
  confirmedDeliveryDate?: string;
  deliveryLocation: string;
  notes: string;
  items: OrderItem[];
  staffReason?: string;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  itemCode: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface DeliveryRecord {
  id: string;
  orderId: string;
  customerName: string;
  scheduledAt: string;
  location: string;
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
  rescheduleReason?: string;
}

export function filterCatalogForRole(records: ProductRecord[], role: UserRole): ProductRecord[] {
  if (role === 'customer') {
    return records.filter((item) => item.isPublished && item.status === 'published' && !item.isArchived);
  }

  return records.filter((item) => !item.isArchived);
}

export function canAccessOrderRecords(role: UserRole, userId: string, targetUserId: string): boolean {
  if (role === 'admin' || role === 'staff') {
    return true;
  }

  return role === 'customer' && userId === targetUserId;
}

export function isValidOrderTransition(current: OrderStatus, next: OrderStatus): boolean {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    Pending: ['Confirmed', 'Rejected', 'Cancelled'],
    Confirmed: ['Processing', 'Rejected', 'Cancelled'],
    Processing: ['Ready', 'Cancelled'],
    Ready: ['Scheduled', 'Cancelled'],
    Scheduled: ['Completed', 'Cancelled'],
    Completed: [],
    Rejected: [],
    Cancelled: [],
  };

  return allowedTransitions[current]?.includes(next) ?? false;
}

export function canReserveStock(available: number, requested: number): boolean {
  return requested <= available;
}

export const demoCredentialUsers = [
  { email: 'customer@demo.com', role: 'customer', password: 'customer123' },
  { email: 'staff@ptri.demo', role: 'staff', password: 'staff123' },
  { email: 'admin@ptri.demo', role: 'admin', password: 'admin123' },
] as const;
