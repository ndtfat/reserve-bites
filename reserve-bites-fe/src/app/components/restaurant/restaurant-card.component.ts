import { Component, Input } from '@angular/core';
import { IRestaurantCard } from 'src/app/types/restaurant.type';

@Component({
  selector: 'restaurant-card',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper {
        width: 100%;
        padding: 6px;
        border-radius: 4px;
        @include cursor;
        transition: 0.2s;
        &:hover {
          transform: translateY(-4px);
          @include shadow;
        }
      }
      img {
        @include img-fit(100%, 150px);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .body {
        padding-top: 10px;
        font-size: 14px;
        p {
          margin-bottom: 4px;
          @include ellipsis;
        }
        .address {
          color: $sub-text-color;
          font-size: 14px;
        }
        .name {
          @include ellipsis;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 4px;
        }
        .operation-time {
          font-size: 16px;
        }
        .price {
          display: inline-block;
          font-size: 14px;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 6px;
          color: #fff;
          background-color: #000;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper" [routerLink]="'/restaurant/' + restaurant.id">
      <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" />
      <div class="body">
        <p class="address">
          {{ restaurant.address.province + ', ' + restaurant.address.country }}
        </p>
        <h6 class="name">
          {{ restaurant.name }}
          <!-- <span>{{ restaurant.rate }}</span> -->
        </h6>
        <p class="operation-time">
          {{ restaurant.operationTime.openTime | time }}
          {{ ' ~ ' }}
          {{ restaurant.operationTime.closeTime | time }}
        </p>
        <p class="open-day">
          {{
            restaurant.operationTime.openDay.length === 7
              ? 'All day in week'
              : restaurant.operationTime.openDay.join(', ')
          }}
        </p>
        <p class="price">
          {{ restaurant.minPrice | price }}
          <span *ngIf="restaurant.minPrice < restaurant.maxPrice">
            {{ ' ~ ' }}
            {{ restaurant.maxPrice | price }}
          </span>
          {{ ' ' + restaurant.currency }}
        </p>
      </div>
    </div>
  `,
})
export class RestaurantCardComponent {
  @Input() restaurant: IRestaurantCard = {
    id: '1',
    name: 'Bún bò dì bốn',
    address: {
      detail: '',
      province: 'Đồng Nai',
      country: 'Việt Nam',
    },
    currency: 'VND',
    minPrice: 20000,
    maxPrice: 50000,
    operationTime: {
      openTime: '07:00',
      closeTime: '19:00',
      openDay: ['Monday', 'Tuesday', 'Friday'],
    },
    mainImage: {
      name: 'example',
      url: 'https://static.vinwonders.com/production/bun-bo-da-lat-banner.jpg',
    },
    rate: 4,
  };
}
