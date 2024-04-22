import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ionChatbubblesOutline } from '@ng-icons/ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { RealTimeService } from 'src/app/services/realTime.service';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { findMaxPrice, findMinPrice } from 'src/app/utils/find';
import { MenuComponent } from '../../main/restaurant/components/menu.component';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'restaurant-tab-overview',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    TimePipe,
    NgIconsModule,
    MenuComponent,
    CarouselModule,
    MatButtonModule,
  ],
  viewProviders: [provideIcons({ ionChatbubblesOutline })],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      .wrapper {
        padding: 20px 0 10px;
      }
      .restaurant-name {
        font-weight: 600;
        margin-bottom: 20px;
        @include flex(row, center, space-between);

        .chat-icon {
          color: $primary;
        }
        .rate {
          font-size: 20px;
          font-weight: 400;
          span {
            font-size: 30px;
            font-weight: 500;
          }
        }
      }
      h5 {
        font-weight: 600;
        margin-bottom: 16px;
      }
      .description.less {
        @include ellipsis(4);
      }
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
      .event-wrapper {
        width: 100%;
        height: 150px;
        display: flex;
        gap: 20px;
        margin-bottom: 10px;
        img {
          @include img-fit(50%, 100%);
          transition: 0.3s;
          &.expand {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            width: auto;
            height: 70vh;
          }
        }
        .desc {
          @include ellipsis(3);
          margin-bottom: 20px;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="restaurant-name">
        <div style="display: flex; align-items: center">
          <h2 style="margin-right: 20px;">{{ restaurant.name }}</h2>
          <span class="rate">
            ( <span>{{ restaurant.rate }}</span
            >/5 )
          </span>
        </div>
        <button
          *ngIf="!isOwner && isAuthenticated"
          mat-raised-button
          matTooltip="Chat with restaurant"
          (click)="handleClickChatButton()"
        >
          <ng-icon name="ionChatbubblesOutline" size="1.5rem" />
        </button>
      </div>

      <!-- Description -->
      <p class="description" [ngClass]="{ less: !showFullDesc }">
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
          {{
            restaurant.address.detail +
              ', ' +
              restaurant.address.province +
              ', ' +
              restaurant.address.country
          }}
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
          {{
            restaurant.operationTime.openDay.length === 7
              ? 'daily'
              : restaurant.operationTime.openDay.join(', ')
          }}
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

      <!-- Event -->
      <div *ngIf="restaurant.events.length > 0" style="margin-bottom: 20px;">
        <h5>Events ({{ restaurant.events.length }})</h5>
        <div class="event-wrapper" *ngFor="let item of restaurant.events">
          <img
            [src]="item.poster.url"
            [alt]="item.name"
            #img
            style="cursor: pointer;"
            (click)="img.classList.toggle('expand')"
          />
          <div style="flex: 1;">
            <h5 style="font-weight: 600; margin-bottom: 10px;">{{ item.name }}</h5>
            <p class="desc">{{ item.desc }}</p>
            <p>End at {{ item.endDate | date : 'dd/MM/yyyy' }}</p>
          </div>
        </div>
      </div>

      <!-- Menu -->
      <h5>Menu</h5>
      <menu [menu]="restaurant.menu" [currency]="restaurant.currency"></menu>

      <!-- End text -->
      <p style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ccc;">
        Move to reviews tab to see what other diner think. :0
      </p>
    </div>
  `,
})
export class RestaurantTabOverviewComponent implements OnInit {
  constructor(private realTime: RealTimeService, private auth: AuthService) {
    auth.user.subscribe((u) => (this.isOwner = !!u?.isOwner));
    auth.isAuthenticated.subscribe((u) => (this.isAuthenticated = u));
  }

  @Input() restaurant!: IRestaurant;
  showFullDesc = false;
  minPrice: string = '';
  maxPrice: string = '';
  isOwner = false;
  isAuthenticated = false;

  ngOnInit() {
    this.minPrice = findMinPrice(this.restaurant.menu).toLocaleString('en-US');
    this.maxPrice = findMaxPrice(this.restaurant.menu).toLocaleString('en-US');
  }

  handleClickChatButton() {
    this.realTime.startConversation(this.restaurant);
  }
}
