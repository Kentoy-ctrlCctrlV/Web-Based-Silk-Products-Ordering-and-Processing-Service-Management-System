export type UserRole = 'customer' | 'staff' | 'admin';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready'
  | 'Scheduled'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type CatalogStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
export type PriceVisibility = 'published' | 'contact_ptri' | 'not_published';
export type PhotoStatus = 'official' | 'approved' | 'unavailable' | 'pending_staff_upload';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  createdAt: string;
}

export interface CatalogSourceRecord {
  sourceUrl: string;
  retrievedAt: string;
  priceEvidence: string;
  photoSourceUrl?: string;
  photoRightsStatus: PhotoStatus;
  verificationNotes: string;
  verifiedBy: string;
}

export interface Product {
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
  sourceUrl?: string;
  sourceNotes?: string;
  priceVisibility: PriceVisibility;
  priceEvidence?: string;
  photoStatus: PhotoStatus;
  photoSourceUrl?: string;
  photoRightsStatus: PhotoStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
  isPublished: boolean;
  isArchived: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface StatusEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
  actor: string;
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
  statusHistory: StatusEvent[];
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

export interface SilkwormBatch {
  id: string;
  lifeStage: string;
  quantity: number;
  location: string;
  condition: string;
  batchReference: string;
  lastUpdated: string;
}

export interface CocoonRecord {
  id: string;
  batchReference: string;
  quantity: number;
  unit: string;
  source: string;
  recordedDate: string;
  notes: string;
}

export interface DeliverySchedule {
  id: string;
  orderId: string;
  customerName: string;
  scheduledAt: string;
  location: string;
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
  rescheduleReason?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  occurredAt: string;
}

export interface OrderRequestInput {
  customerId: string;
  customerName: string;
  deliveryLocation: string;
  notes: string;
  requestedDeliveryDate: string;
  items: OrderItem[];
}
