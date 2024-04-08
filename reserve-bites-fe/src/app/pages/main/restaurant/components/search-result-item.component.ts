import { Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRestaurant, IRestaurantCard } from 'src/app/types/restaurant.type';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { PricePipe } from 'src/app/pipes/price.pipe';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'search-result-item',
  standalone: true,
  imports: [
    PricePipe,
    TimePipe,
    RouterLink,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  styles: [
    `
      @import '../../../../scss/common.scss';
      @import '../../../../scss/variables.scss';
      @import '../../../../scss/responsive.scss';
      .result {
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
          margin: 0;
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
        .result {
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
    <div [ngClass]="{ result: true, open: expand }">
      <div class="overview">
        <img [src]="metadata.mainImage.url" [alt]="metadata.mainImage.name" />
        <div class="restaurant-info">
          <h5>{{ metadata.name }}</h5>
          <span style="flex: 1;"></span>
          <p>
            Own by <span>{{ metadata.owner }}</span>
          </p>
          <p style="margin-top: 4px;">
            {{ metadata.address.province + ', ' + metadata.address.country }}
          </p>
        </div>
        <div
          style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center;"
        >
          <h5>{{ metadata.rate }}</h5>
          <mat-icon class="expand-icon">keyboard_arrow_down</mat-icon>
        </div>
      </div>
      <mat-divider class="divider" />
      <div class="detail">
        <div class="information">
          <div>
            <span>Price:</span>
            <p>
              {{ metadata.minPrice | price }}
              <span *ngIf="metadata.minPrice < metadata.maxPrice">
                {{ ' ~ ' }}
                {{ metadata.maxPrice | price }}
              </span>
              {{ ' ' + metadata.currency }}
            </p>
          </div>
          <div>
            <span>Open time:</span>
            <p>
              {{ metadata.operationTime.openTime | time }}
              {{ ' ~ ' }}
              {{ metadata.operationTime.closeTime | time }}
            </p>
          </div>
          <div>
            <span>Open days:</span>
            <p>
              {{
                metadata.operationTime.openDay.length === 7
                  ? 'All day in week'
                  : metadata.operationTime.openDay.join(', ')
              }}
            </p>
          </div>
          <div>
            <span>Max reservation:</span>
            <p>{{ metadata.maxReservationSize }}</p>
          </div>
        </div>

        <button
          mat-raised-button
          color="primary"
          style="margin: 0 4px 4px 0;"
          [routerLink]="'/restaurant/' + metadata.id"
        >
          Detail
        </button>
      </div>
    </div>
  `,
})
export class SearchResultItemComponent {
  @Input() metadata!: IRestaurantCard;
  @Input({ transform: booleanAttribute }) expand: boolean = false;
}
