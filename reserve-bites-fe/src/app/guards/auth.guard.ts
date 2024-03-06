// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    if (this.authService.isAuthenticated.value) {
      // IUser is authenticated, allow navigation
      return true;
    } else {
      // IUser is not authenticated, redirect to login or handle as needed
      this.router.navigate(['/auth/sign-in']);
      return false;
    }
  }
}
