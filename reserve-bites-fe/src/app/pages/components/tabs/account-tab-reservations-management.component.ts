import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AppSelectComponent } from '../../../components/common/app-select.component';
import { TableReservationManagementComponent } from '../tables/table-reservation-management.component';

@Component({
  selector: 'account-tab-reservations-management',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    TimePipe,
    RouterLink,
    MatInputModule,
    MatDatepickerModule,
    AppSelectComponent,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TableReservationManagementComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
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
        gap: 10px;
      }
    `,
  ],
  template: `
    <div class="wrapper container">
      <div class="filter">
        <mat-form-field class="input" appearance="outline">
          <mat-label>Filter</mat-label>
          <input
            autocomplete="off"
            matInput
            (input)="handleSearch($event)"
            placeholder="Name or email"
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" (dateChange)="handleSelectDate($event)" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        <app-select
          label="State"
          (selectionChange)="handleStatusChange($event)"
          [options]="[
            { value: 'expired', content: 'Expired' },
            { value: 'canceled', content: 'Canceled' },
            { value: 'rejected', content: 'Rejected' },
            { value: 'confirmed', content: 'Confirmed' },
            { value: 'completed', content: 'Completed' },
            { value: 'responding', content: 'Responding' }
          ]"
        />
      </div>

      <div *ngIf="dataSource && !fetching">
        <table-reservation-management [fetching]="fetching" [dataSource]="dataSource" />
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
  columns: string[] = ['restaurant', 'size', 'date', 'time', 'status'];
  fetching = false;
  dataSource: MatTableDataSource<any> | null = null;
  totalItems = 100;
  $searchText = new Subject<string>();
  $filterOptions = new BehaviorSubject<{
    text: string;
    status: string;
    page: number;
    date: Date | null;
  }>({ text: '', status: '', page: 1, date: null });

  constructor(private auth: AuthService, private userSv: UserService) {}

  ngOnInit() {
    this.$searchText
      .pipe(debounceTime(500))
      .subscribe((value) =>
        this.$filterOptions.next({ ...this.$filterOptions.value, text: value }),
      );
    this.$filterOptions.subscribe(async (options) => {
      this.fetching = true;
      const res = await this.userSv.getReservations(options);
      if (res) {
        this.totalItems = res.totalItems;
        this.dataSource = res.itemsList.length > 0 ? new MatTableDataSource(res.itemsList) : null;
      }
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

  handleSelectDate(e: MatDatepickerInputEvent<Date>) {
    this.$filterOptions.next({
      ...this.$filterOptions.value,
      date: e.value as Date,
    });
  }

  handlePageChange(event: PageEvent) {
    this.$filterOptions.next({
      ...this.$filterOptions.value,
      page: event.pageIndex + 1,
    });
  }
}
