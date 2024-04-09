import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { IRestaurantCard } from 'src/app/types/restaurant.type';
import { RestaurantCardComponent } from '../../restaurant/components/restaurant-card.component';

@Component({
  selector: 'home-section-suggest',
  standalone: true,
  imports: [MatTabsModule, RouterLink, NgIf, NgFor, AlertComponent, RestaurantCardComponent],
  styles: [
    `
      @import '../../../../scss/responsive.scss';

      .header {
        gap: 6px;
        display: flex;
        flex-direction: column;
      }

      .card-wrapper {
        gap: 10px;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      @include tablet {
        .header {
          gap: 20px;
          align-items: flex-end;
          flex-direction: row;
        }
      }

      @include desktop {
        .card-wrapper {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    `,
  ],
  template: `
    <div class="header">
      <h4 style="font-weight: 600;">Restaurants chosen for you</h4>
      <p
        routerLink="/restaurant/search"
        [style]="{
                gap: '4px',
                color: '#ee7421',
                cursor: 'pointer',
              }"
      >
        Find more
      </p>
    </div>
    <mat-tab-group>
      <mat-tab label="Popular" *ngIf="topRateRestaurants">
        <div style="margin-top: 10px;">
          <alert *ngIf="errorTopRateRestaurants" type="error">
            {{ errorTopRateRestaurants }}
          </alert>
          <div class="card-wrapper">
            <restaurant-card
              *ngFor="let restaurant of topRateRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>
      </mat-tab>
      <mat-tab label="Your cuisines" *ngIf="suggestRestaurants">
        <div style="margin-top: 10px;">
          <alert *ngIf="errorSuggestRestaurants" type="error">
            {{ errorSuggestRestaurants }}
          </alert>
          <div class="card-wrapper" *ngIf="suggestRestaurants">
            <restaurant-card
              *ngFor="let restaurant of suggestRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>
      </mat-tab>
      <mat-tab label="Local" *ngIf="localRestaurants">
        <div style="margin-top: 10px;">
          <alert *ngIf="errorLocalRestaurants" type="error">
            {{ errorLocalRestaurants }}
          </alert>
          <div class="card-wrapper">
            <restaurant-card
              *ngFor="let restaurant of localRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class HomeSectionSuggestComponent {
  @Input() localRestaurants: IRestaurantCard[] = [];
  @Input() topRateRestaurants: IRestaurantCard[] = [];
  @Input() suggestRestaurants: IRestaurantCard[] = [];
  @Input() errorTopRateRestaurants: string = '';
  @Input() errorSuggestRestaurants: string = '';
  @Input() errorLocalRestaurants: string = '';
}
