import { Component } from '@angular/core';

@Component({
  selector: 'notification-drop-down',
  styles: [],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon
        style="font-size: 30px; width: 30px; height: 30px;"
        matBadge="15"
        matBadgeColor="warn"
      >
        notifications
      </mat-icon>
    </button>
    <mat-menu #menu="matMenu" xPosition="before">
      <button mat-menu-item routerLink="/notification">
        <span>Show all</span>
      </button>
    </mat-menu>
  `,
})
export class NotificationDropDownComponent {}
