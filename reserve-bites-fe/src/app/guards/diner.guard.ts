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
export class DinerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    await this.authService.getUser();
    if (!this.authService.user.value?.isOwner) {
      // IUser is authenticated, allow navigation
      return true;
    } else {
      // IUser is not authenticated, redirect to login or handle as needed
      this.router.navigate(['/account/me']);
      return false;
    }
  }
}
