import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { demoAuditLogs, demoCocoonRecords, demoDeliveries, demoInventory, demoNotifications, demoOrders, demoProducts, demoSilkwormBatches, demoUsers } from '../demo-data';
import {
  AuditLog,
  CatalogStatus,
  CocoonRecord,
  DeliverySchedule,
  InventoryRecord,
  NotificationItem,
  OrderRecord,
  OrderRequestInput,
  OrderStatus,
  Product,
  SilkwormBatch,
  UserProfile,
} from '../models';

@Injectable({ providedIn: 'root' })
export class SilkMartDemoService {
  private readonly products$ = new BehaviorSubject<Product[]>(demoProducts);
  private readonly orders$ = new BehaviorSubject<OrderRecord[]>(demoOrders);
  private readonly inventory$ = new BehaviorSubject<InventoryRecord[]>(demoInventory);
  private readonly batches$ = new BehaviorSubject<SilkwormBatch[]>(demoSilkwormBatches);
  private readonly cocoonRecords$ = new BehaviorSubject<CocoonRecord[]>(demoCocoonRecords);
  private readonly deliveries$ = new BehaviorSubject<DeliverySchedule[]>(demoDeliveries);
  private readonly notifications$ = new BehaviorSubject<NotificationItem[]>(demoNotifications);
  private readonly auditLogs$ = new BehaviorSubject<AuditLog[]>(demoAuditLogs);

  readonly products = this.products$.asObservable();
  readonly orders = this.orders$.asObservable();
  readonly inventory = this.inventory$.asObservable();
  readonly silkwormBatches = this.batches$.asObservable();
  readonly cocoonRecords = this.cocoonRecords$.asObservable();
  readonly deliveries = this.deliveries$.asObservable();
  readonly notifications = this.notifications$.asObservable();
  readonly auditLogs = this.auditLogs$.asObservable();

  getAllProducts(): Product[] {
    return this.products$.value.filter((item) => item.isPublished && item.status === 'published');
  }

  getCatalogDrafts(): Product[] {
    return this.products$.value.filter((item) => !item.isArchived && item.status !== 'published');
  }

  getProductById(id: string): Product | undefined {
    return this.products$.value.find((item) => item.id === id);
  }

  createCatalogDraft(input: Partial<Product>, actorName: string): Product {
    const nextItem: Product = {
      id: `prod-${Date.now()}`,
      name: input.name ?? 'New catalog item',
      category: input.category ?? 'Unspecified',
      description: input.description ?? 'Awaiting source verification.',
      unit: input.unit ?? 'unit',
      price: input.price ?? null,
      availability: input.availability ?? null,
      image: input.image ?? null,
      lowStockThreshold: input.lowStockThreshold ?? null,
      status: input.status ?? 'draft',
      sourceUrl: input.sourceUrl ?? '',
      sourceNotes: input.sourceNotes ?? 'Awaiting authorized PTRI source verification.',
      priceVisibility: input.priceVisibility ?? 'not_published',
      priceEvidence: input.priceEvidence ?? 'Price pending PTRI confirmation.',
      photoStatus: input.photoStatus ?? 'unavailable',
      photoSourceUrl: input.photoSourceUrl ?? '',
      photoRightsStatus: input.photoRightsStatus ?? 'unavailable',
      verifiedBy: input.verifiedBy ?? '',
      verifiedAt: input.verifiedAt ?? '',
      lastUpdatedBy: actorName,
      lastUpdatedAt: new Date().toISOString(),
      isPublished: false,
      isArchived: false,
    };

    this.products$.next([nextItem, ...this.products$.value]);
    return nextItem;
  }

  updateCatalogStatus(id: string, nextStatus: CatalogStatus, actorName: string): Product | null {
    const items = this.products$.value;
    const index = items.findIndex((item) => item.id === id);

    if (index < 0) {
      return null;
    }

    const current = items[index];
    const updated: Product = {
      ...current,
      status: nextStatus,
      isPublished: nextStatus === 'published',
      verifiedBy: current.verifiedBy || actorName,
      verifiedAt: nextStatus === 'published' ? new Date().toISOString() : current.verifiedAt,
      lastUpdatedBy: actorName,
      lastUpdatedAt: new Date().toISOString(),
      isArchived: nextStatus === 'archived',
    };

    items[index] = updated;
    this.products$.next([...items]);

    this.auditLogs$.next([
      {
        id: `audit-${Date.now()}`,
        actor: actorName,
        action: `Catalog item ${nextStatus}`,
        target: id,
        occurredAt: new Date().toISOString(),
      },
      ...this.auditLogs$.value,
    ]);

    return updated;
  }

  getAllOrders(): OrderRecord[] {
    return this.orders$.value;
  }

  getCustomerOrders(customerId: string): OrderRecord[] {
    return this.orders$.value.filter((order) => order.customerId === customerId);
  }

  getOrderById(orderId: string): OrderRecord | undefined {
    return this.orders$.value.find((order) => order.id === orderId);
  }

  getDashboardSummary() {
    const pending = this.orders$.value.filter((order) => order.status === 'Pending').length;
    const lowStock = this.inventory$.value.filter((record) => record.quantity <= record.lowStockThreshold).length;
    const upcomingDeliveries = this.deliveries$.value.filter((delivery) => delivery.status !== 'completed').length;
    const recent = this.auditLogs$.value.slice(0, 4);

    return { pending, lowStock, upcomingDeliveries, recent };
  }

  submitOrder(input: OrderRequestInput): OrderRecord {
    const orderId = `ORD-${Math.max(1, this.orders$.value.length + 1)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      customerId: input.customerId,
      customerName: input.customerName,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      requestedDeliveryDate: input.requestedDeliveryDate,
      deliveryLocation: input.deliveryLocation,
      notes: input.notes,
      items: input.items,
      statusHistory: [
        {
          status: 'Pending',
          label: 'Order requested',
          timestamp: new Date().toISOString(),
          actor: input.customerName,
          note: 'Customer submitted the request and requested a preferred delivery slot.',
        },
      ],
    };

    this.orders$.next([newOrder, ...this.orders$.value]);

    const notification: NotificationItem = {
      id: `note-${Date.now()}`,
      userId: input.customerId,
      message: `Order ${newOrder.id} has been submitted and is waiting for staff review.`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    this.notifications$.next([notification, ...this.notifications$.value]);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor: input.customerName,
      action: 'Created order',
      target: newOrder.id,
      occurredAt: new Date().toISOString(),
    };

    this.auditLogs$.next([audit, ...this.auditLogs$.value]);
    return newOrder;
  }

  updateOrderStatus(orderId: string, nextStatus: OrderStatus, note: string, actorName: string): OrderRecord | null {
    const orders = this.orders$.value;
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex < 0) {
      return null;
    }

    const currentOrder = orders[orderIndex];
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

    if (!allowedTransitions[currentOrder.status]?.includes(nextStatus)) {
      return null;
    }

    const updatedOrder: OrderRecord = {
      ...currentOrder,
      status: nextStatus,
      staffReason: note,
      statusHistory: [
        ...currentOrder.statusHistory,
        {
          status: nextStatus,
          label: `Status updated to ${nextStatus}`,
          timestamp: new Date().toISOString(),
          actor: actorName,
          note,
        },
      ],
    };

    orders[orderIndex] = updatedOrder;
    this.orders$.next([...orders]);

    this.auditLogs$.next([
      {
        id: `audit-${Date.now()}`,
        actor: actorName,
        action: `Set order to ${nextStatus}`,
        target: orderId,
        occurredAt: new Date().toISOString(),
      },
      ...this.auditLogs$.value,
    ]);

    return updatedOrder;
  }

  getUserDetails(userId: string): UserProfile | undefined {
    return demoUsers.find((user) => user.id === userId);
  }

  getNotificationFeed(userId: string): NotificationItem[] {
    return this.notifications$.value.filter((entry) => entry.userId === userId);
  }

  getInventoryOverview(): InventoryRecord[] {
    return this.inventory$.value;
  }

  getSilkwormBatches(): SilkwormBatch[] {
    return this.batches$.value;
  }

  getCocoonRecords(): CocoonRecord[] {
    return this.cocoonRecords$.value;
  }

  getDeliverySchedules(): DeliverySchedule[] {
    return this.deliveries$.value;
  }

  setDeliverySchedule(orderId: string, scheduledAt: string, reason?: string): DeliverySchedule | null {
    const order = this.getOrderById(orderId);
    if (!order) {
      return null;
    }

    const newEntry: DeliverySchedule = {
      id: `del-${Date.now()}`,
      orderId,
      customerName: order.customerName,
      scheduledAt,
      location: order.deliveryLocation,
      status: new Date(scheduledAt).getTime() < Date.now() ? 'overdue' : 'upcoming',
      rescheduleReason: reason,
    };

    const entries = this.deliveries$.value.filter((entry) => entry.orderId !== orderId);
    entries.unshift(newEntry);
    this.deliveries$.next(entries);

    return newEntry;
  }
}
