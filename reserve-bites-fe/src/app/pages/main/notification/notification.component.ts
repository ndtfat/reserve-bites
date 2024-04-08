import { NgFor, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { INotification } from 'src/app/types/notification';
import { SortBy } from 'src/app/types/filter.type';
import { notificationIcon } from 'src/app/utils/messages';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matMarkEmailReadOutline } from '@ng-icons/material-icons/outline';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum Action {
  Delete = 'delete',
  MarkAsReaded = 'markAsReaded',
}

@Component({
  selector: 'notification',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    NgIconsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  viewProviders: [provideIcons({ matMarkEmailReadOutline })],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
      .wrapper {
        margin: 0 30px;
        padding: 20px 0;
        // height: calc(100vh - 40px);
      }
      .container {
        @include flex(column, flex-start, flex-start);
        gap: 20px;
        height: 100%;
      }
      .list {
        width: 100%;

        li {
          @include flex(row, center, flex-start);
          gap: 20px;
          border-radius: 4px;
          padding: 14px 8px;
          cursor: pointer;
          // &:hover,
          &.readed {
            background: rgba(0, 0, 0, 0.03);
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .dot {
            @include onlineDot;
          }
        }
      }
      .icon {
        @include notifIcon;
      }
      .action-icon {
        padding: 6px;
        border-radius: 50%;
        &:hover {
          background: rgba(0, 0, 0, 0.03);
        }
      }
      @include desktop {
        .wrapper {
          max-width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <h3 style="margin-bottom: 10px;">Notifications</h3>

        <div [style]="{ display: 'flex', gap: '10px', alignItems: 'center' }">
          <mat-checkbox
            [style]="{ marginRight: '10px' }"
            color="primary"
            [checked]="selectedNotifIds.length === notificationsList.length"
            (change)="handleSelecAll($event)"
          >
            Select all item in this page
          </mat-checkbox>

          <button
            *ngIf="selectedNotifIds.length > 0"
            mat-icon-button
            matTooltip="Mark as readed"
            (click)="handleActionForSelectedItems(Action.MarkAsReaded)"
          >
            <ng-icon size="1.6rem" name="matMarkEmailReadOutline" />
          </button>
          <button
            *ngIf="selectedNotifIds.length > 0"
            mat-icon-button
            matTooltip="Delete selected item"
            (click)="handleActionForSelectedItems(Action.Delete)"
          >
            <ng-icon size="1.6rem" name="heroTrash" />
          </button>
        </div>

        <!-- <p>{{del}}</p> -->

        <ul *ngIf="!loading" class="list">
          <li *ngFor="let notif of notificationsList" [class]="notif.readed ? 'readed' : ''">
            <mat-checkbox
              color="primary"
              [checked]="selectedNotifIds.includes(notif.id)"
              (change)="handleSelectitem($event, notif.id)"
            />
            <ng-icon [class]="'icon ' + notif.type" [name]="notifIcon[notif.type]" size="2.8rem" />
            <div style="flex: 1">
              <p class="title">{{ notif.title }}</p>
              <p class="message">{{ notif.message }}</p>
            </div>
            <span *ngIf="!notif.readed" class="dot"></span>
            <ng-icon
              class="action-icon"
              name="matMoreHorizOutline"
              size="3rem"
              (click)="$event.stopPropagation()"
              [matMenuTriggerFor]="actionMenu"
            />
            <mat-menu #actionMenu="matMenu" xPosition="before">
              <button
                mat-menu-item
                [routerLink]="
                  notif.additionalInfo.rid
                    ? '/restaurant/' + notif.additionalInfo.rid
                    : '/reservation/' + notif.additionalInfo.reservationId
                "
                [queryParams]="notif.additionalInfo.rid ? { tab: 'reviews' } : {}"
              >
                View
              </button>
              <button
                *ngIf="!notif.readed"
                mat-menu-item
                (click)="handleActionForOneItem(notif.id, Action.MarkAsReaded)"
              >
                Mark as readed
              </button>
              <button mat-menu-item (click)="handleActionForOneItem(notif.id, Action.Delete)">
                Delete
              </button>
            </mat-menu>
          </li>
        </ul>

        <mat-spinner *ngIf="loading" />
        <mat-paginator
          *ngIf="totalItems / 10 > 1"
          showFirstLastButtons
          [length]="totalItems"
          [pageSize]="10"
          (page)="handlePageChange($event)"
        />
      </div>
    </div>
  `,
})
export class NotificationComponent implements OnInit {
  notifIcon = notificationIcon;
  totalPages = 1;
  totalItems = 100;
  loading = false;
  notificationsList: INotification[] = [];
  $pagination = new BehaviorSubject({
    page: 1,
    sortBy: SortBy.DESC,
  });
  selectedNotifIds: string[] = [];
  readonly Action = Action;

  constructor(private userSv: UserService) {}

  async ngOnInit() {
    this.$pagination.subscribe(async ({ page, sortBy }) => {
      this.loading = true;
      const { itemsList, totalPages, totalItems } = await this.userSv.getNotifications(
        page,
        sortBy,
      );
      this.notificationsList = itemsList;
      this.totalPages = totalPages;
      this.totalItems = totalItems;
      this.loading = false;
    });
  }

  handlePageChange(event: PageEvent) {
    this.$pagination.next({
      ...this.$pagination.value,
      page: event.pageIndex + 1,
    });
  }

  handleClickNotification(id: string) {
    if (this.selectedNotifIds.includes(id)) {
      this.selectedNotifIds = this.selectedNotifIds.filter((_id) => _id !== id);
    } else {
      this.selectedNotifIds.push(id);
    }
  }

  handleSelectitem(event: MatCheckboxChange, notifId: string) {
    if (event.checked) {
      this.selectedNotifIds.push(notifId);
    } else {
      this.selectedNotifIds = this.selectedNotifIds.filter((id) => id !== notifId);
    }
  }

  handleSelecAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedNotifIds = this.notificationsList.map((n) => n.id);
    } else {
      this.selectedNotifIds = [];
    }
  }

  handleActionForOneItem(id: string, action: Action) {
    if (action === Action.Delete) {
      this.userSv.deleteNotifications([id]).then((res) => {
        this.$pagination.next({
          page: 1,
          sortBy: SortBy.DESC,
        });
      });
    } else if (action === Action.MarkAsReaded) {
      this.userSv.markNotificationsAsReaded([id]).then((res) => {
        this.notificationsList = this.notificationsList.map((n) => {
          if (n.id === id) {
            return { ...n, readed: true };
          } else {
            return { ...n };
          }
        });
      });
    }
    this.selectedNotifIds = this.selectedNotifIds.filter((_id) => _id !== id);
  }

  handleActionForSelectedItems(action: Action) {
    const ids = this.selectedNotifIds;
    if (action === Action.Delete) {
      this.userSv.deleteNotifications(ids).then((res) => {
        this.$pagination.next({
          page: 1,
          sortBy: SortBy.DESC,
        });
      });
    } else if (action === Action.MarkAsReaded) {
      this.userSv.markNotificationsAsReaded(ids).then((res) => {
        this.notificationsList = this.notificationsList.map((n) => {
          if (ids.includes(n.id)) {
            return { ...n, readed: true };
          } else {
            return { ...n };
          }
        });
      });
    }
    this.selectedNotifIds = this.selectedNotifIds.filter(
      (_id) => !this.selectedNotifIds.includes(_id),
    );
  }
}
