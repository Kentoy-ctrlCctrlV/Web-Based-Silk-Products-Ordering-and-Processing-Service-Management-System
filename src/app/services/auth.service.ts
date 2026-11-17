import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { demoUsers } from '../demo-data';
import { UserProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  private readonly currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly router: Router) {}

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  signIn(email: string, password: string): UserProfile | null {
    const normalizedEmail = email.trim().toLowerCase();
    const matchingAccount = demoUsers.find((user) => user.email.toLowerCase() === normalizedEmail);

    if (!matchingAccount) {
      return null;
    }

    const credentialMap: Record<string, string> = {
      customer: 'customer123',
      staff: 'staff123',
      admin: 'admin123',
    };

    if (password === credentialMap[matchingAccount.role]) {
      this.currentUserSubject.next(matchingAccount);
      return matchingAccount;
    }

    return null;
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/');
  }
}
