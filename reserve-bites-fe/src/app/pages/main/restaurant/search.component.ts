import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { BehaviorSubject, filter } from 'rxjs';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { AppSelectComponent } from 'src/app/components/common/app-select.component';
import { FormInputComponent } from 'src/app/components/common/form-input.component';
import { PricePipe } from 'src/app/pipes/price.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { AlertType } from 'src/app/types/notification';
import { IRestaurantCard } from 'src/app/types/restaurant.type';
import { dayOptions } from 'src/app/utils/form';
import { SearchResultItemComponent } from './components/search-result-item.component';
import { FormSearchFilterComponent } from '../../components/forms/form-search-filter.component';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AlertComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormSearchFilterComponent,
    SearchResultItemComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
      .wrapper {
        margin: 0 30px;
        padding: 20px 0;
        width: $body-width;
      }
      .container {
        @include flex(column, flex-start, flex-start);
        gap: 20px;
      }
      .filter {
        width: 100%;
        border-bottom: 1px solid #ccc;
        padding-bottom: 20px;
      }
      .result {
        flex: 1;
        width: 100%;
        @include flex(column, flex-start, flex-start);
        & > * {
          width: 100%;
        }
      }
      .result-wrapper {
        gap: 10px;
        flex: 1;
        @include flex(column, flex-start, flex-start);
      }

      @include desktop {
        .wrapper {
          margin: 0 auto;
        }
        .container {
          @include flex(row, flex-start, flex-start);
          gap: 20px;
        }
        .filter {
          width: 30%;
          border-right: 1px solid #ccc;
          border-bottom: none;
          padding-right: 20px;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <form-search-filter
          class="filter"
          [filterForm]="filterForm"
          (reset)="handleReset()"
          (search)="handleSearch()"
        />

        <div class="result">
          <h3 style="margin-bottom: 30px;">Results ({{ totalItems }})</h3>

          <alert *ngIf="errorMessage" type="error" style="margin-bottom: 10px;">
            {{ errorMessage }}
          </alert>

          <div *ngIf="!loading && results.length === 0">
            There is no restaurant match the filter.
          </div>

          <div *ngIf="loading">
            <mat-spinner />
          </div>

          <div *ngIf="!loading && results.length > 0" class="result-wrapper">
            <search-result-item
              *ngFor="let item of results"
              #result
              style="width: 100%;"
              [expand]="result.expand || false"
              [metadata]="item"
              (click)="result.expand = !result.expand"
            />
          </div>

          <div *ngIf="results.length > 1" style="margin-top: 20px;">
            <mat-paginator
              showFirstLastButtons
              [length]="totalItems"
              [pageSize]="10"
              (page)="handlePageChange($event)"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SearchComponent implements OnInit {
  dayOptions = dayOptions;

  filterForm = this.fb.group({
    name: [''],
    address: [''],
    size: [1, Validators.min(1)],
    minRate: [0],
    maxRate: [5],
    openDay: [null],
  });

  $page = new BehaviorSubject(1);
  loading = false;
  totalItems = 0;
  filterValid = false;
  errorMessage = '';
  results: IRestaurantCard[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private restaurantSv: RestaurantService,
  ) {
    this.route.queryParams.subscribe((params) => {
      const { size, openDay } = params;
      if (size) {
        this.filterForm.controls.size.setValue(Number(size));
      }
      if (openDay) {
        this.filterForm.controls.openDay.setValue(openDay);
      }
    });
  }

  async ngOnInit() {
    this.$page.subscribe(async (page) => {
      this.loading = true;
      const { name, address, size, minRate, maxRate, openDay } = this.filterForm.value;
      const { totalItems, itemsList, error } = await this.restaurantSv.search(
        name || '',
        address || '',
        size || 1,
        minRate || 0,
        maxRate || 5,
        openDay || '',
        page,
      );
      this.errorMessage = error || '';
      this.totalItems = totalItems;
      this.results = itemsList;
      this.loading = false;
    });
  }

  handleSearch() {
    if (this.filterForm.valid) {
      this.$page.next(1);
      console.log(this.filterForm.value);
    }
  }

  handleReset() {
    this.filterForm.reset();
    this.$page.next(1);
  }

  handlePageChange(event: PageEvent) {
    this.$page.next(event.pageIndex + 1);
  }
}
