import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { PricePipe } from 'src/app/pipes/price.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { AlertType } from 'src/app/types/notification';
import { IRestaurantCard } from 'src/app/types/restaurant.type';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TimePipe,
    PricePipe,
    RouterLink,
    MatIconModule,
    AlertComponent,
    MatSliderModule,
    MatDividerModule,
    MatPaginatorModule,
    AppSelectComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      .wrapper {
        margin: 0 30px;
        padding: 20px 0;
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
      .card-wrapper {
        gap: 10px;
        flex: 1;
        @include flex(column, flex-start, flex-start);
      }
      .restaurant-card {
        width: 100%;
        padding: 8px 10px 8px 8px;
        border-radius: 4px;
        box-shadow: 0 2px 4px 1px #ddd;

        &.open {
          box-shadow: 0 1px 4px 1px $primary--blur;
        }

        &.open .expand-icon {
          transform: rotate(180deg);
        }

        .divider {
          width: 0;
        }

        &.open .divider {
          width: 100%;
          margin: 10px 0;
        }

        .overview {
          width: 100%;
          height: 70px;
          @include flex(row, flex-start, flex-start);
          gap: 10px;
          cursor: pointer;

          img {
            width: 70px;
            height: 100%;
            object-fit: cover;
          }

          .restaurant-info {
            flex: 1;
            height: 100%;
            @include flex(column, flex-start, space-between);
            & > * {
              @include ellipsis(1);
            }
            p {
              font-size: 14px;
            }
            p span {
              color: $primary;
            }
          }
        }

        .detail {
          height: 0;
          overflow: hidden;
          transition: 0.3s;
          @include flex(column, space-between, flex-start);
          .information {
            flex: 1;
          }
          .information > div {
            display: flex;
            gap: 10px;
          }
          .information > div span {
            font-weight: bold;
          }
        }

        &.open .detail {
          height: 150px;
        }
      }

      @include desktop {
        .wrapper {
          max-width: $body-width;
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
        .restaurant-card {
          .overview img {
            width: 130px;
          }
          .detail {
            @include flex(row, flex-end, space-between);
            .information > div span {
              flex-basis: 150px;
              font-weight: bold;
            }
          }
          &.open .detail {
            height: 100px;
          }
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <form [formGroup]="filterForm" class="filter">
          <h3 style="margin-bottom: 30px;">Filter</h3>

          <form-input
            [formGroup]="filterForm"
            name="name"
            label="Search"
            placeholder="Restaurent name..."
          />
          <form-input
            [formGroup]="filterForm"
            name="address"
            label="Address"
            placeholder="Province, Country"
          />

          <div style="display: flex; gap: 10px; width: 100%;">
            <div style="width: 30%;">
              <form-input [formGroup]="filterForm" name="size" type="number" label="Size" />
            </div>
            <div style="flex: 1; min-width: 10px;">
              <app-select
                name="openDay"
                label="Open day"
                [options]="dayOptions"
                [formGroup]="filterForm"
              />
            </div>
          </div>

          <div style="display: flex; align-items: center">
            <h6 style="margin-right: 20px;">Rating:</h6>
            <mat-slider min="0" max="5" step="1" discrete style="flex: 1;">
              <input value="0" matSliderStartThumb formControlName="minRate" />
              <input value="5" matSliderEndThumb formControlName="maxRate" />
            </mat-slider>
          </div>

          <div
            style="margin-top: 30px; width: 100%; display: flex; justify-content: space-between; gap: 20px"
          >
            <button mat-raised-button style="flex: 1" (click)="handleReset()">Reset</button>
            <button mat-raised-button style="flex: 1" color="primary" (click)="handleSearch()">
              Search
            </button>
          </div>
        </form>

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

          <div *ngIf="!loading && results.length > 0" class="card-wrapper">
            <div *ngFor="let restaurant of results" class="restaurant-card">
              <div class="overview" (click)="handleExpand($event)">
                <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" />
                <div class="restaurant-info">
                  <h5>{{ restaurant.name }}</h5>
                  <span style="flex: 1;"></span>
                  <p>
                    Own by <span>{{ restaurant.owner }}</span>
                  </p>
                  <p style="margin-top: 4px;">
                    {{ restaurant.address.province + ', ' + restaurant.address.country }}
                  </p>
                </div>
                <div
                  style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center;"
                >
                  <h5>{{ restaurant.rate }}</h5>
                  <mat-icon class="expand-icon">keyboard_arrow_down</mat-icon>
                </div>
              </div>
              <mat-divider class="divider" />
              <div class="detail">
                <div class="information">
                  <div>
                    <span>Price:</span>
                    <p>
                      {{ restaurant.minPrice | price }}
                      <span *ngIf="restaurant.minPrice < restaurant.maxPrice">
                        {{ ' ~ ' }}
                        {{ restaurant.maxPrice | price }}
                      </span>
                      {{ ' ' + restaurant.currency }}
                    </p>
                  </div>
                  <div>
                    <span>Open time:</span>
                    <p>
                      {{ restaurant.operationTime.openTime | time }}
                      {{ ' ~ ' }}
                      {{ restaurant.operationTime.closeTime | time }}
                    </p>
                  </div>
                  <div>
                    <span>Open days:</span>
                    <p>
                      {{
                        restaurant.operationTime.openDay.length === 7
                          ? 'All day in week'
                          : restaurant.operationTime.openDay.join(', ')
                      }}
                    </p>
                  </div>
                  <div>
                    <span>Max reservation:</span>
                    <p>{{ restaurant.maxReservationSize }}</p>
                  </div>
                </div>

                <button
                  mat-raised-button
                  color="primary"
                  style="margin: 0 4px 4px 0;"
                  [routerLink]="'/restaurant/' + restaurant.id"
                >
                  Detail
                </button>
              </div>
            </div>
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
  dayOptions = ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
    (day) => {
      return { value: day.substring(0, 3), content: day };
    },
  );

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
      const { name, address } = params;
      if (name) {
        this.filterForm.controls.name.setValue(name);
      }
      if (address) {
        this.filterForm.controls.address.setValue(address);
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

  handleExpand(event: Event) {
    const element = (event.target as HTMLButtonElement).closest('.restaurant-card');
    if (!element?.classList.contains('open')) {
      document.querySelector('.restaurant-card.open')?.classList.remove('open');
    }
    element?.classList.toggle('open');
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
