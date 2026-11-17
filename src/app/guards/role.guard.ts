import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { DemoAuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class CustomerGuard implements CanActivate {
  constructor(
    private readonly authService: DemoAuthService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUser;
    if (user && (user.role === 'customer' || user.role === 'admin')) {
      return true;
    }

    this.router.navigateByUrl('/login');
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class StaffGuard implements CanActivate {
  constructor(
    private readonly authService: DemoAuthService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUser;
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      return true;
    }

    this.router.navigateByUrl('/login');
    return false;
  }
}
