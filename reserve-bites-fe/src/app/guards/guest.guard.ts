// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  async canActivate(): Promise<boolean> {
    await this.authService.getUser();

    return true;
  }
}
