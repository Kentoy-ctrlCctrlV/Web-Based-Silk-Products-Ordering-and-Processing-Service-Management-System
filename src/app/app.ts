import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { DemoAuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(DemoAuthService);

  get currentUser() {
    return this.authService.currentUser;
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === 'customer';
  }

  get isStaff(): boolean {
    return this.currentUser?.role === 'staff';
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  signOut(): void {
    this.authService.signOut();
  }
}
