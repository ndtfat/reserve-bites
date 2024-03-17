import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'header',
  styles: [
    `
      @import '../scss/common.scss';
      @import '../scss/variables.scss';
      @import '../scss/responsive.scss';
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        @include flex(row, center, space-between);
        min-height: $header-height;
        color: #000;
        background: #fff;
        @include shadow;
        z-index: 999;
      }
      .buttons {
        display: flex;
        gap: 20px;
        button {
          @include flex(row, center, center);
        }
      }
      .outlet-wrapper {
        min-height: 100vh;
        width: 100vw;
        background: #f5f6f8;
        margin-top: $header-height;
        display: flex;
        justify-content: center;
        .outlet-content {
          // width: min($body-width, 80vw);
        }
      }
      .chat {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 100;
      }
      .toggle-chat-btn {
        color: $primary;
        background: #fff;
        width: 60px;
        height: 60px;
        font-size: 30px;
        @include flex(row, center, center);
        @include cursor;
        @include shadow;
      }
      .chat-box {
        position: absolute;
        right: 100%;
        bottom: 100%;
        transform-origin: right bottom;
        transform: scale(0.4);
        opacity: 0;
        pointer-events: none;
        transition: 0.2s;
        &.open {
          transform: scale(1);
          opacity: 1;
          pointer-events: all;
        }
      }

      @include mobile {
        .header {
          padding: 0 10px;
        }
        .logo-with-text {
          display: none;
        }
        .buttons {
          gap: 10px;
          span {
            display: none;
          }
        }
      }
      @include tablet {
        .header {
          padding: 0 40px;
        }
        .logo-no-text {
          display: none;
        }
        .logo-with-text {
          display: block;
        }
        .buttons {
          gap: 20px;
          span {
            display: block;
          }
          .icon {
            display: none !important;
          }
        }
      }
    `,
  ],
  template: `
    <div class="header">
      <logo class="logo-with-text" [width]="200" color="white" [text]="true" />
      <div>
        <span *ngIf="isAuthenticated" class="buttons">
          <notification-drop-down />
          <account-drop-down />
        </span>

        <div *ngIf="!isAuthenticated" class="buttons">
          <button mat-raised-button routerLink="/auth/sign-in">
            <span>SIGN IN</span>
          </button>
          <button mat-raised-button color="primary" routerLink="/auth/sign-up">
            <span>SIGN UP</span>
          </button>
        </div>
      </div>
    </div>
    <div class="outlet-wrapper">
      <div class="outlet-content">
        <router-outlet />
      </div>
    </div>
    <div class="chat" *ngIf="isAuthenticated">
      <button mat-icon-button class="toggle-chat-btn" (click)="openChatBox = !openChatBox">
        <ng-icon size="30" [name]="openChatBox ? 'ionClose' : 'ionChatbubbleEllipsesOutline'" />
      </button>
      <chat-box class="chat-box" [ngClass]="{ open: openChatBox }" />
    </div>
  `,
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  openChatBox = false;

  constructor(private auth: AuthService) {
    this.auth.isAuthenticated.subscribe((value) => {
      this.isAuthenticated = value;
    });
  }
}
