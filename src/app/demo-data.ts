import {
  AuditLog,
  CocoonRecord,
  DeliverySchedule,
  InventoryRecord,
  NotificationItem,
  OrderRecord,
  Product,
  SilkwormBatch,
  UserProfile,
} from './models';

export const demoUsers: UserProfile[] = [
  {
    id: 'cust-001',
    name: 'Test Customer',
    email: 'customer@demo.com',
    role: 'customer',
    phone: '+63 917 000 0000',
    address: 'Cagayan de Oro City, Misamis Oriental',
    createdAt: '2025-01-10T09:00:00+08:00',
  },
  {
    id: 'staff-001',
    name: 'Staff Reviewer',
    email: 'staff@ptri.demo',
    role: 'staff',
    phone: '+63 920 000 0000',
    address: 'PTRI Technology Center, Villanueva',
    createdAt: '2024-11-01T08:00:00+08:00',
  },
  {
    id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@ptri.demo',
    role: 'admin',
    phone: '+63 930 000 0000',
    address: 'PTRI HQ',
    createdAt: '2024-11-01T08:00:00+08:00',
  },
];

export const demoProducts: Product[] = [];

export const demoInventory: InventoryRecord[] = [];

export const demoSilkwormBatches: SilkwormBatch[] = [];

export const demoCocoonRecords: CocoonRecord[] = [];

export const demoOrders: OrderRecord[] = [];

export const demoDeliveries: DeliverySchedule[] = [];

export const demoNotifications: NotificationItem[] = [];

export const demoAuditLogs: AuditLog[] = [];
