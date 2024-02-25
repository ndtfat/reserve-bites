import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'account-drop-down',
  styles: [],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon style="font-size: 30px; width: 30px; height: 30px;">account_circle</mat-icon>
    </button>
    <mat-menu #menu="matMenu" xPosition="before">
      <span *ngIf="isAuthenticated">
        <button mat-menu-item routerLink="/account/me">
          <span>My Account</span>
        </button>
        <button
          mat-menu-item
          style="border-top: 1px solid #ccc;"
          (click)="signOut()"
        >
          <span>Sign out</span>
        </button>
      </span>

      <span *ngIf="!isAuthenticated">
        <button mat-menu-item routerLink="/auth/sign-in">
          <span>Sign in</span>
        </button>
        <button mat-menu-item routerLink="/auth/sign-up">
          <span>Sign up</span>
        </button>
        <button mat-menu-item routerLink="/register-restaurant">
          <span>Regist restaurant</span>
        </button>
      </span>
    </mat-menu>
  `,
})
export class AccountDropDownComponent {
  isAuthenticated: boolean = false;

  constructor(private auth: AuthService) {
    this.auth.isAuthenticated.subscribe((value) => {
      this.isAuthenticated = value;
    });
  }

  signOut() {
    this.auth.signOut();
  }
}
