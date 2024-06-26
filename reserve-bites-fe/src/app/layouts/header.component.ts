import { RealTimeService } from 'src/app/services/realTime.service';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LogoComponent } from '../components/common/logo.component';
import { NotificationDropDownComponent } from '../components/header/notification-drop-down.component';
import { AccountDropDownComponent } from '../components/header/account-drop-down.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ionChatbubbleEllipsesOutline, ionClose } from '@ng-icons/ionicons';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatBoxComponent } from '../components/chat/chat-box.component';
import { NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'header',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    RouterOutlet,
    NgIconsModule,
    LogoComponent,
    MatBadgeModule,
    MatButtonModule,
    ChatBoxComponent,
    AccountDropDownComponent,
    NotificationDropDownComponent,
  ],
  viewProviders: [provideIcons({ ionClose, ionChatbubbleEllipsesOutline })],
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
        min-height: calc(100vh - $header-height);
        width: 100vw;
        background: $light-background;
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
          <button mat-raised-button color="black" routerLink="/auth/sign-up">
            <span>SIGN UP</span>
          </button>
        </div>
      </div>
    </div>
    <div class="outlet-wrapper">
      <div class="outlet-content">
        <router-outlet (activate)="handleActivate()" />
      </div>
    </div>
    <div class="chat" *ngIf="isAuthenticated">
      <button mat-icon-button class="toggle-chat-btn" (click)="openChatBox = !openChatBox">
        <ng-icon
          size="30"
          [name]="openChatBox ? 'ionClose' : 'ionChatbubbleEllipsesOutline'"
          [matBadge]="numUnReadChatBox || null"
          matBadgeColor="warn"
        />
      </button>
      <chat-box class="chat-box" [ngClass]="{ open: openChatBox }" />
    </div>
  `,
})
export class HeaderComponent {
  openChatBox = false;
  numUnReadChatBox = 0;
  isAuthenticated: boolean = false;

  constructor(private auth: AuthService, private realTime: RealTimeService) {
    this.auth.isAuthenticated.subscribe((value) => {
      this.isAuthenticated = value;
    });

    this.realTime.openedConversation.subscribe((id) => {
      if (id) {
        this.openChatBox = true;
      }
    });

    this.realTime.numUnReadChatBox.subscribe((num) => {
      if (this.openChatBox) this.realTime.numUnReadChatBox.next(0);
      else this.numUnReadChatBox = num;
    });
  }

  handleActivate() {
    window.scroll(0, 0);
  }

  handleToggleChat() {
    this.openChatBox = !this.openChatBox;
    if (this.openChatBox) {
      this.numUnReadChatBox = 0;
      this.realTime.numUnReadChatBox.next(0);
    }
  }
}
