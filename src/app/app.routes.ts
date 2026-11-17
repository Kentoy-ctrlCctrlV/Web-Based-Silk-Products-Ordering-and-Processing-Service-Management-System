import { Routes } from '@angular/router';

import {
  CatalogDetailPage,
  CatalogManagementPage,
  CatalogPage,
  CheckoutPage,
  CustomerDashboardPage,
  CustomerOrderDetailPage,
  DeliveryPage,
  InventoryPage,
  LandingPage,
  LoginPage,
  SilkwormPage,
  StaffDashboardPage,
  StaffOrderDetailPage,
} from './pages/silk-pages';
import { CustomerGuard, StaffGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'catalog', component: CatalogPage },
  { path: 'catalog/:id', component: CatalogDetailPage },
  { path: 'login', component: LoginPage },
  { path: 'checkout', component: CheckoutPage, canActivate: [CustomerGuard] },
  { path: 'customer', component: CustomerDashboardPage, canActivate: [CustomerGuard] },
  { path: 'customer/order/:id', component: CustomerOrderDetailPage, canActivate: [CustomerGuard] },
  { path: 'staff', component: StaffDashboardPage, canActivate: [StaffGuard] },
  { path: 'staff/catalog', component: CatalogManagementPage, canActivate: [StaffGuard] },
  { path: 'staff/order/:id', component: StaffOrderDetailPage, canActivate: [StaffGuard] },
  { path: 'staff/inventory', component: InventoryPage, canActivate: [StaffGuard] },
  { path: 'staff/deliveries', component: DeliveryPage, canActivate: [StaffGuard] },
  { path: 'staff/silkworms', component: SilkwormPage, canActivate: [StaffGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
