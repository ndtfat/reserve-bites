import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRestaurantEvent } from 'src/app/types/restaurant.type';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-section-events',
  standalone: true,
  imports: [CommonModule, CarouselModule, MatButtonModule, RouterLink],
  styles: [
    `
      @import '../../../../scss/common.scss';
      .event-wrapper {
        width: 100%;
        height: 300px;
        display: flex;
        gap: 20px;
      }

      img {
        @include img-fit(70%, 100%);
      }
      .desc {
        @include ellipsis(3);
        margin-bottom: 20px;
      }
    `,
  ],
  template: `
    <h4 style="font-weight: 600; margin-bottom: 20px;">Events</h4>
    <div style="width: 100%;">
      <carousel [noPause]="false" [interval]="3000" [isAnimated]="true" [showIndicators]="false">
        <slide *ngFor="let item of events">
          <div class="event-wrapper">
            <img [src]="item.poster.url" [alt]="item.name" />
            <div style="flex: 1;">
              <h3 style="font-weight: 600; margin-bottom: 10px;">{{ item.name }}</h3>
              <p class="desc">{{ item.desc }}</p>
              <button mat-raised-button [routerLink]="'/restaurant/' + item.restaurant.id">
                Go to restaurant
              </button>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  `,
})
export class HomeSectionEventsComponent {
  @Input() events: IRestaurantEvent[] = [];
}
