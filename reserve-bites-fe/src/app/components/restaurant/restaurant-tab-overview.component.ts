import { Component, Input, OnInit } from '@angular/core';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { findMaxPrice, findMinPrice } from 'src/app/utils/find';

@Component({
  selector: 'restaurant-tab-overview',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper { padding: 20px 0 10px; }
      h2 {
        font-weight: 600;
        margin-bottom: 20px;
        @include flex(row, center, space-between);
        .rate {
          font-size: 20px;
          font-weight: 400;
          span {
            font-size: 40px;
            font-weight: 500;
          }
        }
      }
      h5 {
        font-weight: 600;
        margin-bottom: 16px;
      }
      .description.less { @include ellipsis(4); }
      .toggle-description {
        color: $primary;
        margin-bottom: 20px;
      }
      .overview {
        margin-bottom: 30px;
        p {
          margin-bottom: 10px;
          .icon {
            display: inline-flex;
            padding: 6px;
            border-radius: 4px;
            margin-right: 10px;
            background-color: $primary--blur;
            color: $primary;
          }
        }
      }
      .carousel {
        margin-bottom: 30px;
        img {
          @include img-fit(100%, 300px);
          border-radius: 4px;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>
        {{ restaurant.name }}
        <span class="rate">
          <span>{{ restaurant.rate }}</span>/5
        </span>
      </h2>

      <!-- Description -->
      <p class="description" [ngClass]="{less: !showFullDesc}">
        {{ restaurant.description }}
      </p>
      <p class="toggle-description" (click)="showFullDesc = !showFullDesc">
        {{ showFullDesc ? 'Show less' : 'Read more' }}
      </p>

      <!-- Overview -->
      <div class="overview">
        <p>
          <span class="icon">
            <ng-icon size="18" name="ionPersonOutline" />
          </span>
          Own by
          <a routerLink="/" style="text-decoration: underline;">
            {{ restaurant.owner.firstName + ' ' + restaurant.owner.lastName }}
          </a>
        </p>
        <p>
          <span class="icon">
            <ng-icon size="18" name="ionLocationOutline" />
          </span>
          {{ restaurant.address.detail + ', ' + restaurant.address.province + ', ' + restaurant.address.country }}
        </p>
        <p>
          <span class="icon">
            <ng-icon size="18" name="ionCashOutline" />
          </span>
          {{ minPrice + ' ~ ' + maxPrice + ' ' + restaurant.currency }}
        </p>
        <p>
          <span class="icon">
            <ng-icon size="18" name="heroClock" />
          </span>
          {{ restaurant.operationTime.openTime | time }}
          {{ ' ~ ' }}
          {{ restaurant.operationTime.closeTime | time }}
          on
          {{ restaurant.operationTime.openDay.length === 7 ? 'daily' : restaurant.operationTime.openDay.join(', ') }}
        </p>
      </div>

      <!-- Gallery -->
      <div class="carousel" *ngIf="restaurant.gallery.length > 0">
        <h5>Restaurant photos ({{ restaurant.gallery.length }})</h5>
        <carousel [noPause]="false" [interval]="3000" [isAnimated]="true">
          <slide *ngFor="let item of restaurant.gallery">
            <img [src]="item.url" [alt]="item.name" />
          </slide>
        </carousel>
      </div>

      <!-- Menu -->
      <h5>Menu</h5>
      <menu [menu]="restaurant.menu" [currency]="restaurant.currency"></menu>

      <!-- End text -->
      <p
        style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc;"
      >
        Move to reviews tab to see what other diner think. :0
      </p>
    </div>
  `,
})
export class RestaurantTabOverviewComponent implements OnInit {
  @Input() restaurant!: IRestaurant;
  showFullDesc = false;
  minPrice: string = ''
  maxPrice: string = ''

  ngOnInit() {
    this.minPrice = findMinPrice(this.restaurant.menu).toLocaleString('en-US');
    this.maxPrice = findMaxPrice(this.restaurant.menu).toLocaleString('en-US');
  }
}
