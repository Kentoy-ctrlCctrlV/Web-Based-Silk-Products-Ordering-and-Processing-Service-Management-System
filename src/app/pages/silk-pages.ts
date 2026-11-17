import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DemoAuthService } from '../services/auth.service';
import { SilkMartDemoService } from '../services/demo-store.service';
import { OrderStatus, Product } from '../models';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Prototype for PTRI silk operations</span>
        <h1>SilkMart helps teams manage orders, stock, and delivery planning.</h1>
        <p>
          A lightweight, demo-ready platform for monitoring customer orders, preferred delivery windows,
          silk product inventory, and cocoon records in a trustworthy operations workflow.
        </p>
        <div class="cta-row">
          <a class="btn btn-primary" routerLink="/catalog">Browse catalog</a>
          <a class="btn btn-secondary" routerLink="/login">Customer sign in</a>
        </div>
      </div>
      <div class="hero-card">
        <div class="card-surface">
          <div class="status-pill">Demo mode</div>
          <h3>Operational snapshot</h3>
          <div class="metric-columns">
            <div>
              <strong>{{ summary.pending }}</strong>
              <span>Pending orders</span>
            </div>
            <div>
              <strong>{{ summary.lowStock }}</strong>
              <span>Low stock</span>
            </div>
            <div>
              <strong>{{ summary.upcomingDeliveries }}</strong>
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-block">
      <div class="section-header">
        <span class="eyebrow">Catalog status</span>
        <h2>Verified PTRI catalog records are not yet published</h2>
      </div>
      @if (featuredProducts.length === 0) {
        <div class="empty-state">
          No verified public catalog items are currently published. Staff can add source-verified items only after PTRI authorization and operational review.
        </div>
      } @else {
        <div class="product-grid">
          @for (product of featuredProducts; track product.id) {
            <article class="product-card">
              <img [src]="product.image || 'https://placehold.co/600x400/edf2ed/4a5d4b?text=Photo+unavailable'" [alt]="product.name" />
              <div class="product-body">
                <div class="tag-row">
                  <span>{{ product.category }}</span>
                  <span>{{ product.status }}</span>
                </div>
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <div class="product-meta">
                  <strong>{{ product.price !== null ? '₱' + (product.price | number: '1.2-2') : 'Price not published' }}</strong>
                  <a [routerLink]="['/catalog', product.id]">Details</a>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>

    <section class="info-grid">
      <article class="info-panel">
        <span class="eyebrow">How ordering works</span>
        <h3>Simple, transparent customer flow</h3>
        <ol>
          <li>Browse products and confirm availability.</li>
          <li>Submit a request with a preferred delivery window.</li>
          <li>Staff confirm, reject, or reschedule with a reason.</li>
          <li>Track the latest status updates and schedule.</li>
        </ol>
      </article>
      <article class="info-panel">
        <span class="eyebrow">Operational focus</span>
        <h3>Built around silk supply workflows</h3>
        <ul>
          <li>Product inventory and low-stock monitoring</li>
          <li>Silkworm batch record tracking</li>
          <li>Cocoon records and quality notes</li>
          <li>Delivery scheduling and customer updates</li>
        </ul>
      </article>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
      align-items: center;
      padding: 2.5rem 0 1rem;
    }
    .hero-copy h1 {
      font-size: clamp(2.5rem, 4vw, 4rem);
      margin: 0.5rem 0 1rem;
    }
    .cta-row {
      display: flex;
      gap: 0.8rem;
      margin-top: 1.3rem;
      flex-wrap: wrap;
    }
    .metric-columns {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.8rem;
      margin-top: 1rem;
    }
    .metric-columns div {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      background: #f6f3eb;
      padding: 0.8rem 0.7rem;
      border-radius: 12px;
    }
    .metric-columns strong {
      font-size: 1.8rem;
    }
    .feature-block, .info-grid {
      margin-top: 2.5rem;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.2rem;
    }
    .product-card {
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(44, 81, 58, 0.12);
      border-radius: 18px;
      overflow: hidden;
    }
    .product-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
    }
    .product-body {
      padding: 1rem;
    }
    .tag-row, .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.7rem;
    }
    .tag-row {
      font-size: 0.72rem;
      color: #446a52;
      margin-bottom: 0.8rem;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.2rem;
    }
    .info-panel {
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(44,81,58,0.12);
      border-radius: 18px;
      padding: 1.2rem 1.3rem;
    }
    .info-panel ol, .info-panel ul {
      margin: 1rem 0 0;
      padding-left: 1.2rem;
      line-height: 1.8;
    }
    @media (max-width: 800px) {
      .hero, .product-grid, .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class LandingPage {
  private readonly store = inject(SilkMartDemoService);
  readonly summary = this.store.getDashboardSummary();
  readonly featuredProducts = this.store.getAllProducts().slice(0, 3);
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Catalog</span>
        <h1>Available silk products</h1>
      </div>
      <a class="btn btn-primary" routerLink="/checkout">Create order</a>
    </section>

    <div class="filter-row">
      <input [(ngModel)]="searchTerm" placeholder="Search by product name, category, or description" />
    </div>

    @if (filteredProducts.length === 0) {
      <div class="empty-state">No products match your search.</div>
    } @else {
      <div class="product-grid large">
        @for (product of filteredProducts; track product.id) {
          <article class="product-card">
            <img [src]="product.image" [alt]="product.name" />
            <div class="product-body">
              <div class="tag-row">
                <span>{{ product.category }}</span>
                <span>{{ product.availability }} available</span>
              </div>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-meta">
                <strong>₱{{ product.price | number: '1.2-2' }}</strong>
                <a [routerLink]="['/catalog', product.id]">Details</a>
              </div>
            </div>
          </article>
        }
      </div>
    }
  `,
  styles: [`
    .filter-row {
      margin: 1rem 0 1.2rem;
    }
    .filter-row input {
      width: 100%;
      border: 1px solid rgba(52, 88, 66, 0.2);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      font: inherit;
      background: rgba(255,255,255,0.8);
    }
    .product-grid.large {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (max-width: 760px) {
      .product-grid.large { grid-template-columns: 1fr; }
    }
  `],
})
export class CatalogPage {
  private readonly store = inject(SilkMartDemoService);
  searchTerm = '';

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    const items = this.store.getAllProducts();
    if (!term) {
      return items;
    }
    return items.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term),
    );
  }
}

@Component({
  selector: 'app-catalog-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Catalog administration</span>
        <h1>Review and publish approved product records</h1>
      </div>
    </section>

    <div class="catalog-admin-layout">
      <section class="panel">
        <h3>New draft record</h3>
        <form [formGroup]="catalogForm" (ngSubmit)="saveDraft()">
          <div class="field-grid">
            <label>Product name <input formControlName="name" /></label>
            <label>Category <input formControlName="category" /></label>
            <label>Unit <input formControlName="unit" /></label>
            <label>Price <input type="number" formControlName="price" min="0" step="0.01" /></label>
            <label>Availability <input type="number" formControlName="availability" min="0" /></label>
            <label>Low stock threshold <input type="number" formControlName="lowStockThreshold" min="0" /></label>
          </div>

          <label>Description <textarea formControlName="description"></textarea></label>
          <label>Official source URL <input formControlName="sourceUrl" placeholder="https://ptri.dost.gov.ph/..." /></label>
          <label>Price evidence or status <textarea formControlName="priceEvidence"></textarea></label>
          <label>Photo source URL or staff note <input formControlName="photoSourceUrl" /></label>
          <label>Verification notes <textarea formControlName="sourceNotes"></textarea></label>
          <label>Verified by <input formControlName="verifiedBy" /></label>

          <div class="action-row">
            <button class="btn btn-primary" type="submit">Save draft</button>
          </div>
        </form>
      </section>

      <section class="panel">
        <h3>Staff review queue</h3>
        @if (drafts.length === 0) {
          <div class="empty-state">No draft or unverified catalog records are pending review.</div>
        } @else {
          @for (item of drafts; track item.id) {
            <article class="draft-card">
              <div class="draft-header">
                <strong>{{ item.name }}</strong>
                <span class="status-badge">{{ item.status }}</span>
              </div>
              <p>{{ item.description }}</p>
              <ul>
                <li>Price: {{ item.price !== null ? '₱' + item.price.toFixed(2) : 'Price not published' }}</li>
                <li>Source: {{ item.sourceUrl || 'Not yet recorded' }}</li>
                <li>Photo: {{ item.photoStatus }}</li>
                <li>Verified by: {{ item.verifiedBy || 'Awaiting review' }}</li>
              </ul>
              <div class="action-row">
                <button class="btn btn-primary" type="button" (click)="publish(item.id)">Publish</button>
                <button class="btn btn-secondary" type="button" (click)="archive(item.id)">Archive</button>
              </div>
            </article>
          }
        }
      </section>
    </div>
  `,
  styles: [`
    .catalog-admin-layout {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 1rem;
    }
    .panel {
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(49,88,62,0.12);
      border-radius: 18px;
      padding: 1rem 1.1rem;
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-weight: 600;
    }
    input, textarea {
      background: white;
      border: 1px solid rgba(48,83,66,0.2);
      border-radius: 12px;
      padding: 0.8rem 0.9rem;
      font: inherit;
    }
    textarea {
      min-height: 110px;
      resize: vertical;
    }
    .draft-card {
      border: 1px solid rgba(49,88,62,0.12);
      border-radius: 14px;
      padding: 0.9rem;
      margin-top: 0.8rem;
      background: #f9f7f3;
    }
    .draft-header {
      display: flex;
      justify-content: space-between;
      gap: 0.8rem;
      align-items: center;
    }
    .action-row {
      display: flex;
      gap: 0.8rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    @media (max-width: 860px) {
      .catalog-admin-layout, .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class CatalogManagementPage {
  private readonly store = inject(SilkMartDemoService);
  readonly drafts = this.store.getCatalogDrafts();

  readonly catalogForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('Raw materials', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('Awaiting verification notes.', { nonNullable: true, validators: [Validators.required] }),
    unit: new FormControl('kg', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl<number | null>(null),
    availability: new FormControl<number | null>(null),
    lowStockThreshold: new FormControl<number | null>(null),
    sourceUrl: new FormControl('', { nonNullable: true }),
    priceEvidence: new FormControl('Price pending PTRI confirmation.', { nonNullable: true }),
    photoSourceUrl: new FormControl('', { nonNullable: true }),
    sourceNotes: new FormControl('Awaiting authorized verification record.', { nonNullable: true }),
    verifiedBy: new FormControl('', { nonNullable: true }),
  });

  saveDraft(): void {
    const value = this.catalogForm.getRawValue();
    if (!value.name || !value.category || !value.description) return;

    this.store.createCatalogDraft(
      {
        name: value.name,
        category: value.category,
        description: value.description,
        unit: value.unit,
        price: value.price ?? null,
        availability: value.availability ?? null,
        lowStockThreshold: value.lowStockThreshold ?? null,
        sourceUrl: value.sourceUrl ?? '',
        priceEvidence: value.priceEvidence ?? 'Price pending PTRI confirmation.',
        photoSourceUrl: value.photoSourceUrl ?? '',
        sourceNotes: value.sourceNotes ?? 'Awaiting authorized verification record.',
        verifiedBy: value.verifiedBy ?? '',
        priceVisibility: value.price ? 'published' : 'contact_ptri',
        photoStatus: value.photoSourceUrl ? 'approved' : 'pending_staff_upload',
      },
      'Staff reviewer',
    );

    this.catalogForm.reset({
      name: '',
      category: 'Raw materials',
      description: 'Awaiting verification notes.',
      unit: 'kg',
      price: null,
      availability: null,
      lowStockThreshold: null,
      sourceUrl: '',
      priceEvidence: 'Price pending PTRI confirmation.',
      photoSourceUrl: '',
      sourceNotes: 'Awaiting authorized verification record.',
      verifiedBy: '',
    });
  }

  publish(itemId: string): void {
    this.store.updateCatalogStatus(itemId, 'published', 'Staff reviewer');
  }

  archive(itemId: string): void {
    this.store.updateCatalogStatus(itemId, 'archived', 'Staff reviewer');
  }
}

@Component({
  selector: 'app-catalog-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (product) {
      <section class="detail-layout">
        <img [src]="product.image" [alt]="product.name" />
        <div class="detail-copy">
          <span class="eyebrow">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <p>{{ product.description }}</p>
          <div class="detail-metrics">
            <div><strong>{{ product.availability }}</strong><span>Available</span></div>
            <div><strong>₱{{ product.price | number: '1.2-2' }}</strong><span>Unit price</span></div>
            <div><strong>{{ product.unit }}</strong><span>Unit</span></div>
          </div>
          <div class="cta-row">
            <a class="btn btn-primary" routerLink="/checkout">Request this item</a>
            <a class="btn btn-secondary" routerLink="/catalog">Back to catalog</a>
          </div>
        </div>
      </section>
    } @else {
      <div class="empty-state">Product not found.</div>
    }
  `,
  styles: [`
    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }
    .detail-layout img {
      width: 100%;
      height: 440px;
      object-fit: cover;
      border-radius: 24px;
      box-shadow: 0 18px 28px rgba(58,83,65,0.15);
    }
    .detail-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin: 1.3rem 0;
    }
    .detail-metrics div {
      background: #f5f2ea;
      border-radius: 12px;
      padding: 0.8rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    @media (max-width: 760px) {
      .detail-layout { grid-template-columns: 1fr; }
    }
  `],
})
export class CatalogDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SilkMartDemoService);
  readonly product = this.store.getProductById(this.route.snapshot.params['id']);
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="auth-layout">
      <div class="auth-panel">
        <span class="eyebrow">Secure demo access</span>
        <h1>Sign in to SilkMart</h1>
        <form [formGroup]="loginForm" (ngSubmit)="signIn()">
          <label>
            Email
            <input formControlName="email" type="email" placeholder="customer@demo.com" />
          </label>
          <label>
            Password
            <input formControlName="password" type="password" placeholder="customer123 or staff123" />
          </label>
          @if (errorMessage) {<div class="error-box">{{ errorMessage }}</div>}
          <button class="btn btn-primary full" type="submit" [disabled]="loginForm.invalid">Sign in</button>
        </form>
        <div class="demo-actions">
          <button class="btn btn-secondary" type="button" (click)="quickLogin('customer')">Demo customer</button>
          <button class="btn btn-secondary" type="button" (click)="quickLogin('staff')">Demo staff</button>
          <button class="btn btn-secondary" type="button" (click)="quickLogin('admin')">Demo admin</button>
        </div>
      </div>
      <div class="auth-panel alt-panel">
        <span class="eyebrow">Prototype onboarding</span>
        <h2>Demo credentials</h2>
        <ul>
          <li>Customer: customer@demo.com / customer123</li>
          <li>Staff: staff@ptri.demo / staff123</li>
          <li>Administrator: admin@ptri.demo / admin123</li>
        </ul>
        <p>
          These credentials are test fixtures only. Production access requires PTRI authorization, verified staff assignment, and server-side access control.
        </p>
      </div>
    </section>
  `,
  styles: [`
    .auth-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 1.2rem;
      margin-top: 1rem;
    }
    .auth-panel {
      background: rgba(255,255,255,0.84);
      border-radius: 22px;
      border: 1px solid rgba(60,85,66,0.1);
      padding: 1.5rem;
    }
    .alt-panel { background: linear-gradient(180deg, #f5f0e7, #edf4ef); }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-weight: 600;
    }
    input {
      border: 1px solid rgba(58,86,66,0.2);
      border-radius: 12px;
      padding: 0.8rem 0.9rem;
      font: inherit;
      background: white;
    }
    .error-box {
      background: #fff2f0;
      color: #a33819;
      border: 1px solid rgba(163, 56, 25, 0.12);
      border-radius: 10px;
      padding: 0.8rem 0.9rem;
    }
    .demo-actions {
      display: flex;
      gap: 0.8rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    @media (max-width: 780px) { .auth-layout { grid-template-columns: 1fr; } }
  `],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(DemoAuthService);
  private readonly router = inject(Router);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage = '';

  signIn(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const user = this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
    if (!user) {
      this.errorMessage = 'Incorrect email or password. Use the demo credentials shown on the right.';
      return;
    }

    this.router.navigateByUrl(user.role === 'customer' ? '/customer' : '/staff');
  }

  quickLogin(role: 'customer' | 'staff' | 'admin'): void {
    const credentials = {
      customer: { email: 'customer@demo.com', password: 'customer123' },
      staff: { email: 'staff@ptri.demo', password: 'staff123' },
      admin: { email: 'admin@ptri.demo', password: 'admin123' },
    };
    const selected = credentials[role];
    this.loginForm.setValue({ email: selected.email, password: selected.password });
    this.signIn();
  }
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="checkout-layout">
      <div class="checkout-card">
        <span class="eyebrow">Customer order request</span>
        <h1>Review your order</h1>
        <div class="products-selected">
          @for (product of catalog; track product.id) {
            <div class="item-selector">
              <div>
                <strong>{{ product.name }}</strong>
                <small>{{ product.unit }}</small>
              </div>
              <div class="qty-controls">
                <button type="button" (click)="updateQuantity(product.id, -1)">-</button>
                <span>{{ selectedQuantities[product.id] ?? 0 }}</span>
                <button type="button" (click)="updateQuantity(product.id, 1)">+</button>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="checkout-card">
        <form [formGroup]="orderForm" (ngSubmit)="submitOrder()">
          <label>
            Full name
            <input formControlName="customerName" type="text" />
          </label>
          <label>
            Delivery location
            <input formControlName="deliveryLocation" type="text" />
          </label>
          <label>
            Preferred delivery date and time
            <input formControlName="requestedDeliveryDate" type="datetime-local" />
          </label>
          <label>
            Notes
            <textarea formControlName="notes"></textarea>
          </label>
          <div class="order-summary">
            <span>Items selected</span><strong>{{ totalItems }}</strong>
            <span>Estimated value</span><strong>₱{{ totalAmount | number: '1.2-2' }}</strong>
          </div>
          <p class="small-note">This preferred date is a request, not a confirmed appointment, until reviewed by staff.</p>
          @if (errorMessage) {
            <div class="error-box">{{ errorMessage }}</div>
          }
          <button class="btn btn-primary full" type="submit" [disabled]="orderForm.invalid || totalItems === 0">Submit order request</button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2rem;
    }
    .checkout-card {
      background: rgba(255,255,255,0.82);
      border-radius: 22px;
      border: 1px solid rgba(41,66,50,0.1);
      padding: 1.4rem;
    }
    .products-selected {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .item-selector {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f0e7;
      border-radius: 14px;
      padding: 0.85rem 1rem;
    }
    .item-selector small { display: block; color: #526b5d; }
    .qty-controls {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .qty-controls button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(58,85,66,0.2);
      background: white;
      cursor: pointer;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input, textarea {
      width: 100%;
      border: 1px solid rgba(61,87,70,0.2);
      border-radius: 12px;
      padding: 0.75rem 0.8rem;
      font: inherit;
      background: white;
    }
    textarea { min-height: 100px; resize: vertical; }
    .order-summary {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.4rem 1rem;
      background: #f1faf4;
      border-radius: 12px;
      padding: 0.8rem 0.9rem;
    }
    .small-note {
      color: #4c6752;
      margin: 0;
    }
    .error-box {
      background: #fff2f0;
      color: #a33819;
      border: 1px solid rgba(163,56,25,0.12);
      padding: 0.8rem 0.9rem;
      border-radius: 10px;
    }
    @media (max-width: 780px) {
      .checkout-layout { grid-template-columns: 1fr; }
    }
  `],
})
export class CheckoutPage {
  private readonly authService = inject(DemoAuthService);
  private readonly store = inject(SilkMartDemoService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly catalog = this.store.getAllProducts();
  selectedQuantities: Record<string, number> = {};
  errorMessage = '';

  readonly orderForm: FormGroup = this.fb.group({
    customerName: ['', Validators.required],
    deliveryLocation: ['', Validators.required],
    requestedDeliveryDate: ['', Validators.required],
    notes: [''],
  });

  get totalItems(): number {
    return Object.values(this.selectedQuantities).reduce((sum, quantity) => sum + quantity, 0);
  }

  get totalAmount(): number {
    return this.catalog.reduce((sum, product) => {
      const quantity = this.selectedQuantities[product.id] ?? 0;
      const unitPrice = product.price ?? 0;
      return sum + unitPrice * quantity;
    }, 0);
  }

  updateQuantity(productId: string, delta: number): void {
    const next = (this.selectedQuantities[productId] ?? 0) + delta;
    if (next <= 0) {
      delete this.selectedQuantities[productId];
      return;
    }
    this.selectedQuantities[productId] = next;
  }

  submitOrder(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.orderForm.invalid || this.totalItems === 0) {
      this.errorMessage = 'Please fill in all required details and select at least one product.';
      return;
    }

    const items = this.catalog
      .filter((product) => (this.selectedQuantities[product.id] ?? 0) > 0)
      .map((product) => ({
        productId: product.id,
        productName: product.name,
        quantity: this.selectedQuantities[product.id] ?? 0,
        unitPrice: product.price ?? 0,
      }));

    const newOrder = this.store.submitOrder({
      customerId: user.id,
      customerName: this.orderForm.value.customerName || user.name,
      deliveryLocation: this.orderForm.value.deliveryLocation,
      notes: this.orderForm.value.notes ?? '',
      requestedDeliveryDate: this.orderForm.value.requestedDeliveryDate,
      items,
    });

    this.router.navigateByUrl(`/customer/order/${newOrder.id}`);
  }
}

@Component({
  selector: 'app-customer-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Customer</span>
        <h1>Welcome {{ currentUser?.name }}</h1>
      </div>
      <a class="btn btn-primary" routerLink="/checkout">Submit order</a>
    </section>

    <div class="stats-grid">
      <div class="stats-card"><span>Open requests</span><strong>{{ openOrders }}</strong></div>
      <div class="stats-card"><span>Confirmed</span><strong>{{ confirmedOrders }}</strong></div>
      <div class="stats-card"><span>Next delivery</span><strong>{{ nextDeliveryLabel }}</strong></div>
    </div>

    <div class="boxed-section">
      <div class="section-header compact">
        <h2>Recent orders</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Status</th>
              <th>Preferred date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders; track order.id) {
              <tr>
                <td>{{ order.id }}</td>
                <td><span class="status-badge">{{ order.status }}</span></td>
                <td>{{ order.requestedDeliveryDate | date: 'MMM d, y, h:mm a' }}</td>
                <td><a [routerLink]="['/customer/order', order.id]">View</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.2rem;
    }
    .stats-card {
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(48,90,62,0.12);
      border-radius: 16px;
      padding: 1rem;
    }
    .stats-card span { display: block; color: #687a6d; }
    .stats-card strong {
      display: block;
      font-size: 1.7rem;
      margin-top: 0.4rem;
    }
    .boxed-section {
      background: rgba(255,255,255,0.82);
      border-radius: 18px;
      padding: 1rem 1.2rem;
      border: 1px solid rgba(49,88,62,0.12);
    }
    .status-badge {
      display: inline-flex;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      background: #ecf5ee;
      color: #1b5f3a;
      font-weight: 700;
    }
    @media (max-width: 760px) { .stats-grid { grid-template-columns: 1fr; } }
  `],
})
export class CustomerDashboardPage {
  private readonly authService = inject(DemoAuthService);
  private readonly store = inject(SilkMartDemoService);
  readonly currentUser = this.authService.currentUser;
  readonly orders = this.currentUser ? this.store.getCustomerOrders(this.currentUser.id) : [];

  get openOrders(): number {
    return this.orders.filter((order) => order.status !== 'Completed' && order.status !== 'Rejected' && order.status !== 'Cancelled').length;
  }

  get confirmedOrders(): number {
    return this.orders.filter((order) => ['Confirmed', 'Processing', 'Ready', 'Scheduled'].includes(order.status)).length;
  }

  get nextDeliveryLabel(): string {
    const next = this.orders
      .filter((order) => order.confirmedDeliveryDate)
      .sort((a, b) => new Date(a.confirmedDeliveryDate ?? a.requestedDeliveryDate).getTime() - new Date(b.confirmedDeliveryDate ?? b.requestedDeliveryDate).getTime())[0];

    return next ? new Date(next.confirmedDeliveryDate ?? next.requestedDeliveryDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
  }
}

@Component({
  selector: 'app-customer-order-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (order) {
      <section class="detail-shell">
        <div class="header-row">
          <div>
            <span class="eyebrow">Order detail</span>
            <h1>{{ order.id }}</h1>
          </div>
          <span class="status-badge">{{ order.status }}</span>
        </div>

        <div class="detail-grid">
          <div class="panel">
            <h3>Order summary</h3>
            <ul class="info-list">
              <li><span>Requested date</span><strong>{{ order.requestedDeliveryDate | date: 'MMM d, y, h:mm a' }}</strong></li>
              <li><span>Confirmed date</span><strong>{{ order.confirmedDeliveryDate ? (order.confirmedDeliveryDate | date: 'MMM d, y, h:mm a') : 'Not confirmed yet' }}</strong></li>
              <li><span>Delivery location</span><strong>{{ order.deliveryLocation }}</strong></li>
              <li><span>Notes</span><strong>{{ order.notes || 'No specific notes' }}</strong></li>
            </ul>
          </div>
          <div class="panel">
            <h3>Order items</h3>
            @for (item of order.items; track item.productId) {
              <div class="line-item">
                <span>{{ item.productName }}</span>
                <strong>{{ item.quantity }} x ₱{{ item.unitPrice | number: '1.2-2' }}</strong>
              </div>
            }
          </div>
        </div>

        <div class="panel">
          <h3>Status timeline</h3>
          <div class="timeline">
            @for (entry of order.statusHistory; track entry.timestamp) {
              <div class="timeline-item">
                <div class="dot"></div>
                <div>
                  <strong>{{ entry.label }}</strong>
                  <small>{{ entry.timestamp | date: 'MMM d, y, h:mm a' }}</small>
                  @if (entry.note) {
                    <p>{{ entry.note }}</p>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    } @else {
      <div class="empty-state">Order not found.</div>
    }
  `,
  styles: [`
    .detail-shell { display: flex; flex-direction: column; gap: 1.2rem; }
    .header-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .panel {
      background: rgba(255,255,255,0.84);
      border: 1px solid rgba(53,90,68,0.12);
      border-radius: 18px;
      padding: 1.1rem;
    }
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .info-list li { display: flex; justify-content: space-between; gap: 1rem; }
    .line-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0;
      border-bottom: 1px solid rgba(58,87,69,0.1);
    }
    .timeline { display: flex; flex-direction: column; gap: 0.9rem; margin-top: 0.8rem; }
    .timeline-item { display: grid; grid-template-columns: 18px 1fr; gap: 0.8rem; }
    .dot { width: 12px; height: 12px; background: #2a7356; border-radius: 50%; margin-top: 0.25rem; }
    @media (max-width: 760px) { .detail-grid { grid-template-columns: 1fr; } }
  `],
})
export class CustomerOrderDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SilkMartDemoService);
  readonly order = this.store.getOrderById(this.route.snapshot.params['id']);
}

@Component({
  selector: 'app-staff-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header staff-head">
      <div>
        <span class="eyebrow">Staff operations</span>
        <h1>Operations dashboard</h1>
      </div>
      <div class="quick-links">
        <a class="btn btn-primary" routerLink="/staff/inventory">Inventory</a>
        <a class="btn btn-secondary" routerLink="/staff/deliveries">Deliveries</a>
      </div>
    </section>

    <div class="stats-grid">
      <div class="stats-card"><span>Pending orders</span><strong>{{ summary.pending }}</strong></div>
      <div class="stats-card"><span>Stock alerts</span><strong>{{ summary.lowStock }}</strong></div>
      <div class="stats-card"><span>Upcoming deliveries</span><strong>{{ summary.upcomingDeliveries }}</strong></div>
    </div>

    <div class="focus-row">
      <div class="panel">
        <h3>AI assistance</h3>
        <p class="muted">Not configured</p>
        <div class="ai-box">
          <strong>Deterministic fallback</strong>
          <p>When no provider is configured, the system uses the dashboard values and order data to support staff decisions.</p>
        </div>
      </div>
      <div class="panel">
        <h3>Recent activity</h3>
        <ul class="activity-list">
          @for (entry of summary.recent; track entry.id) {
            <li><strong>{{ entry.action }}</strong><span>{{ entry.occurredAt | date: 'MMM d, y' }}</span></li>
          }
        </ul>
      </div>
    </div>

    <div class="boxed-section">
      <div class="section-header compact">
        <h2>Order queue</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders; track order.id) {
              <tr>
                <td>{{ order.id }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.requestedDeliveryDate | date: 'MMM d, y' }}</td>
                <td><a [routerLink]="['/staff/order', order.id]">Open</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .staff-head { display: flex; justify-content: space-between; align-items: center; }
    .quick-links { display: flex; gap: 0.7rem; flex-wrap: wrap; }
    .focus-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin: 1.2rem 0;
    }
    .panel {
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(53,89,67,0.12);
      border-radius: 18px;
      padding: 1rem 1.1rem;
    }
    .muted { color: #5d7062; }
    .ai-box {
      background: #f5f2ea;
      border-radius: 12px;
      padding: 0.9rem;
      margin-top: 0.8rem;
    }
    .activity-list { list-style: none; padding: 0; margin: 0.75rem 0 0; }
    .activity-list li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.25rem 0; }
    @media (max-width: 760px) {
      .staff-head { display: grid; grid-template-columns: 1fr; }
      .focus-row { grid-template-columns: 1fr; }
    }
  `],
})
export class StaffDashboardPage {
  private readonly store = inject(SilkMartDemoService);
  readonly summary = this.store.getDashboardSummary();
  readonly orders = this.store.getAllOrders();
}

@Component({
  selector: 'app-staff-order-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (order) {
      <section class="detail-shell">
        <div class="header-row">
          <div>
            <span class="eyebrow">Staff review</span>
            <h1>{{ order.id }}</h1>
          </div>
          <span class="status-badge">{{ order.status }}</span>
        </div>

        <div class="detail-grid">
          <div class="panel">
            <h3>Customer request</h3>
            <ul class="info-list">
              <li><span>Customer</span><strong>{{ order.customerName }}</strong></li>
              <li><span>Requested delivery</span><strong>{{ order.requestedDeliveryDate | date: 'MMM d, y, h:mm a' }}</strong></li>
              <li><span>Location</span><strong>{{ order.deliveryLocation }}</strong></li>
              <li><span>Notes</span><strong>{{ order.notes || 'No notes' }}</strong></li>
            </ul>
          </div>
          <div class="panel">
            <h3>Review action</h3>
            <label>
              Decision note
              <textarea [value]="decisionNote" (input)="decisionNote = $any($event.target).value"></textarea>
            </label>
            <div class="action-row">
              <button class="btn btn-primary" type="button" (click)="applyStatus('Confirmed')">Confirm</button>
              <button class="btn btn-secondary" type="button" (click)="applyStatus('Rejected')">Reject</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>Order items</h3>
          @for (item of order.items; track item.productId) {
            <div class="line-item">
              <span>{{ item.productName }}</span>
              <strong>{{ item.quantity }}</strong>
            </div>
          }
        </div>
      </section>
    } @else {
      <div class="empty-state">Order not found.</div>
    }
  `,
  styles: [`
    .detail-shell { display: flex; flex-direction: column; gap: 1rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .panel {
      background: rgba(255,255,255,0.85);
      border: 1px solid rgba(58,88,66,0.1);
      border-radius: 18px;
      padding: 1rem;
    }
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .info-list li { display: flex; justify-content: space-between; gap: 1rem; }
    textarea {
      width: 100%;
      min-height: 100px;
      border: 1px solid rgba(57,84,63,0.2);
      border-radius: 12px;
      resize: vertical;
      padding: 0.8rem;
      font: inherit;
      background: white;
    }
    .action-row { display: flex; gap: 0.75rem; margin-top: 1rem; }
    .line-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(57,84,63,0.1); }
    @media (max-width: 760px) { .detail-grid { grid-template-columns: 1fr; } }
  `],
})
export class StaffOrderDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SilkMartDemoService);
  private readonly router = inject(Router);

  order = this.store.getOrderById(this.route.snapshot.params['id']);
  decisionNote = '';

  applyStatus(status: OrderStatus): void {
    if (!this.order) {
      return;
    }

    const result = this.store.updateOrderStatus(this.order.id, status, this.decisionNote || `Updated to ${status} by staff.`, 'Alicia Ramos');
    if (result) {
      this.order = result;
      this.router.navigateByUrl('/staff');
    }
  }
}

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Inventory</span>
        <h1>Product stock overview</h1>
      </div>
      <a class="btn btn-primary" routerLink="/staff">Back to dashboard</a>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Item code</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Low threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (item of inventory; track item.id) {
            <tr>
              <td>{{ item.itemCode }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.quantity }} {{ item.unit }}</td>
              <td>{{ item.lowStockThreshold }}</td>
              <td>
                <span class="status-badge {{ item.quantity <= item.lowStockThreshold ? 'warn' : 'ok' }}">
                  {{ item.quantity <= item.lowStockThreshold ? 'Low stock' : 'Healthy' }}
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .status-badge.warn { background: #fff1d9; color: #8a5a1b; }
    .status-badge.ok { background: #ebf7ee; color: #215f3d; }
  `],
})
export class InventoryPage {
  private readonly store = inject(SilkMartDemoService);
  readonly inventory = this.store.getInventoryOverview();
}

@Component({
  selector: 'app-silkworm-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Silkworm batch records</span>
        <h1>Batch monitoring</h1>
      </div>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Batch</th>
            <th>Life stage</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          @for (batch of batches; track batch.id) {
            <tr>
              <td>{{ batch.batchReference }}</td>
              <td>{{ batch.lifeStage }}</td>
              <td>{{ batch.quantity }}</td>
              <td>{{ batch.location }}</td>
              <td>{{ batch.condition }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class SilkwormPage {
  private readonly store = inject(SilkMartDemoService);
  readonly batches = this.store.getSilkwormBatches();
}

@Component({
  selector: 'app-delivery-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Delivery schedule</span>
        <h1>Manual scheduling board</h1>
      </div>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Scheduled</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (delivery of deliveries; track delivery.id) {
            <tr>
              <td>{{ delivery.orderId }}</td>
              <td>{{ delivery.customerName }}</td>
              <td>{{ delivery.scheduledAt | date: 'MMM d, y, h:mm a' }}</td>
              <td>{{ delivery.location }}</td>
              <td>{{ delivery.status }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DeliveryPage {
  private readonly store = inject(SilkMartDemoService);
  readonly deliveries = this.store.getDeliverySchedules();
}
