import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'account-tab-reservations-management',
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        margin: 20px 0;
        background: #fff;
      }
      table {
        box-shadow: none !important;
      }
      .filter {
        display: flex;
        margin-top: 16px;
        .input {
          min-width: 300px;
          margin-right: 20px;
        }
      }
      .element-row:hover {
        cursor: pointer;
        background: whitesmoke;
      }
      .mat-column-restaurant {
        flex: 0 0 28% !important;
        width: 40% !important;
        padding: 10px 20px 10px 0;
        p {
          font-size: 16px;
          @include ellipsis(1);
        }
      }
      .restaurant-img {
        width: 100px;
        height: 60px;
        object-fit: cover;
        border-radius: 3px;
      }
      .status {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 9999px;
        &:first-letter {
          text-transform: uppercase;
        }
        &.confirmed {
          color: #1f931e;
          background-color: #e9f6e9;
        }
        &.responding {
          color: #e69216;
          background-color: #fff6e8;
        }
        &.canceled {
          color: #c51d1a;
          background-color: #fbe9e8;
        }
        &.rejected {
          color: #333;
          background-color: #eee;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper container">
      <div class="filter">
        <mat-form-field class="input" appearance="outline">
          <mat-label>Filter</mat-label>
          <input autocomplete="off" matInput (input)="handleSearch($event)" />
        </mat-form-field>
        <app-select
          label="State"
          (selectionChange)="handleStatusChange($event)"
          [options]="[
            { value: 'canceled', content: 'Canceled' },
            { value: 'rejected', content: 'Rejected' },
            { value: 'confirmed', content: 'Confirmed' },
            { value: 'completed', content: 'Completed' },
            { value: 'responsing', content: 'Responsing' }
          ]"
        />
      </div>

      <div *ngIf="dataSource && !fetching">
        <table mat-table class="mat-elevation-z8" [dataSource]="dataSource">
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns" class="element-row"></tr>

          <ng-container *ngIf="isOwner" matColumnDef="diner">
            <th mat-header-cell *matHeaderCellDef>Diner</th>
            <td mat-cell *matCellDef="let element">
              <p>
                {{ element.diner }}
              </p>
            </td>
          </ng-container>

          <ng-container *ngIf="isOwner" matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">
              <p>
                {{ element.email }}
              </p>
            </td>
          </ng-container>

          <ng-container *ngIf="!isOwner" matColumnDef="restaurant">
            <th mat-header-cell *matHeaderCellDef>Restaurant</th>
            <td mat-cell *matCellDef="let element">
              <p>
                {{ element.restaurant }}
              </p>
            </td>
          </ng-container>

          <ng-container matColumnDef="size">
            <th mat-header-cell *matHeaderCellDef>Party size</th>
            <td mat-cell *matCellDef="let element">{{ element.size }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let element">
              {{ element.date | date : 'MMM dd, yyyy' }}
            </td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef>Time</th>
            <td mat-cell *matCellDef="let element">
              {{ element.time | time }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">
              <p [class]="'status ' + element.status">
                {{ element.status }}
              </p>
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element">
              <ng-icon
                class="action-icon"
                name="matMoreHorizOutline"
                size="1.4rem"
                (click)="$event.stopPropagation()"
                [matMenuTriggerFor]="actionMenu"
              />
              <mat-menu #actionMenu="matMenu" xPosition="before">
                <button mat-menu-item [routerLink]="'/reservation/' + element.id">View</button>
                <button mat-menu-item>Mark as readed</button>
              </mat-menu>
            </td>
          </ng-container>
        </table>
      </div>

      <div *ngIf="!dataSource && !fetching">There aren't any reservations.</div>
      <mat-spinner *ngIf="fetching" />
      <mat-paginator
        *ngIf="dataSource && totalItems / 10 > 1"
        showFirstLastButtons
        [length]="totalItems"
        [pageSize]="10"
        (page)="handlePageChange($event)"
      />
    </div>
  `,
})
export class AccountTabReservationsManagementComponent implements OnInit {
  isOwner = false;
  columns: string[] = ['restaurant', 'size', 'date', 'time', 'status'];
  fetching = false;
  dataSource: MatTableDataSource<any> | null = null;
  totalItems = 100;
  $searchText = new Subject<string>();
  $filterOptions = new BehaviorSubject({ text: '', status: '', page: 1 });

  constructor(private auth: AuthService, private userSv: UserService) {}

  ngOnInit() {
    this.auth.user.subscribe((u) => {
      this.isOwner = u?.isOwner as boolean;
      if (u?.isOwner) {
        this.columns = ['diner', 'email', 'size', 'date', 'time', 'status', 'action'];
      }
    });

    this.$searchText
      .pipe(debounceTime(500))
      .subscribe((value) =>
        this.$filterOptions.next({ ...this.$filterOptions.value, text: value }),
      );
    this.$filterOptions.subscribe(async (options) => {
      this.fetching = true;
      const { page, totalItems, itemsList } = await this.userSv.getReservations(options);
      this.totalItems = totalItems;
      this.dataSource = itemsList.length > 0 ? new MatTableDataSource(itemsList) : null;
      this.fetching = false;
    });
  }

  handleSearch(event: Event) {
    this.$searchText.next((event.target as HTMLInputElement).value);
  }

  handleStatusChange(status: string | string[]) {
    this.$filterOptions.next({
      ...this.$filterOptions.value,
      status: status as string,
    });
  }

  handlePageChange(event: PageEvent) {
    this.$filterOptions.next({
      ...this.$filterOptions.value,
      page: event.pageIndex + 1,
    });
  }
}
