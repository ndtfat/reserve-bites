import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { INotification } from 'src/app/types/notification';
import { notificationIcon, notificationMessage } from 'src/app/utils/notification';

@Component({
  selector: 'notification-drop-down',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';

      .notif-item {
        width: 410px;
        padding-top: 10px;
        overflow: hidden;
        @include scrollbar;

        .body {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .icon {
          color: #fff;
          padding: 6px;
          background: lightblue;
          border-radius: 4px;

          &.RESERVATION,
          &.POST_REVIEW {
            color: $text-info-color;
            background-color: $bg-info;
          }
          &.DELETE_REVIEW {
            color: $text-error-color;
            background-color: $bg-error;
          }
          &.UPDATE_REVIEW {
            color: $text-warn-color;
            background-color: $bg-warn;
          }
        }

        .title {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .message {
          @include ellipsis;
          font-size: 13px;
        }

        .time {
          font-size: 13px;
        }
      }
    `,
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" (click)="unReadNotif = 0">
      <mat-icon
        style="font-size: 30px; width: 30px; height: 30px;"
        matBadgeColor="warn"
        [matBadge]="unReadNotif > 0 ? unReadNotif : null"
      >
        notifications
      </mat-icon>
    </button>
    <mat-menu #menu="matMenu" xPosition="before">
      <div style="max-height: calc(57.2px * 6); overflow-y: auto">
        <button *ngFor="let n of notificationList" mat-menu-item class="notif-item">
          <div class="body">
            <ng-icon [class]="'icon ' + n.type" [name]="notifIcon[n.type]" size="2.2rem" />
            <div style="flex: 1;">
              <p class="title">{{ n.title }}</p>
              <p class="message">{{ n.message }}</p>
            </div>
            <div class="time">
              <p>{{ n.createdAt | time }}</p>
              <p>{{ n.createdAt | date : 'dd/MM/YYYY' }}</p>
            </div>
          </div>
          <mat-divider style="margin-top: 10px;" />
        </button>
      </div>

      <button mat-menu-item routerLink="/notification">
        <div style="text-align: center;">
          {{ notificationList.length === 0 ? 'Your have no notifications' : 'Show all' }}
        </div>
      </button>
    </mat-menu>
  `,
})
export class NotificationDropDownComponent implements OnInit {
  notifIcon = notificationIcon;
  unReadNotif = 0;
  notificationList: INotification[] = [];

  constructor(private userSv: UserService, private socket: SocketService) {}

  async ngOnInit() {
    const { itemsList } = await this.userSv.getNotifications(1);
    this.notificationList = itemsList.reverse();

    this.socket.receiveNotification().subscribe({
      next: (n) => {
        this.notificationList.unshift({
          ...n,
          title: n.sender.firstName + n.sender.lastName,
          message: notificationMessage[n.type],
        });
        this.unReadNotif += 1;
      },
    });
  }
}
