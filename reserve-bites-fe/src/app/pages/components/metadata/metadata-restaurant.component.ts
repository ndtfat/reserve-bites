import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { MenuComponent } from '../../main/restaurant/components/menu.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ionImage } from '@ng-icons/ionicons';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'metadata-restaurant',
  standalone: true,
  imports: [CommonModule, MenuComponent, NgIconsModule, TimePipe, MatButtonModule],
  viewProviders: [provideIcons({ ionImage })],
  template: `
    <div>
      <div class="row">
        <div>
          <p class="field">Restaurant name</p>
          <p class="value">
            {{ restaurant.name }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Description</p>
          <p class="value">
            {{ restaurant.description }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Address</p>
          <p class="value">
            <span>{{ restaurant.address.detail }}</span>
            -
            <span>{{ restaurant.address.province }}</span>
            -
            <span>{{ restaurant.address.country }}</span>
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Operation time</p>
          <p class="value">
            {{ restaurant.operationTime.openTime | time }} ~
            {{ restaurant.operationTime.closeTime | time }}
          </p>
        </div>
        <div>
          <p class="field">Operation day(s)</p>
          <p class="value">
            {{
              restaurant.operationTime.openDay.length === 7
                ? 'All day of week'
                : restaurant.operationTime.openDay.join(', ')
            }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Main iamge</p>
          <p class="value">
            <a [href]="restaurant.mainImage.url">
              <ng-icon name="ionImage" class="image-icon" />
              {{ restaurant.mainImage.name }}
            </a>
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Gallery</p>
          <p class="value gallery">
            <a *ngFor="let img of restaurant.gallery" [href]="img.url">
              <ng-icon name="ionImage" class="image-icon" /> {{ img.name }}
            </a>
            <span *ngIf="restaurant.gallery.length === 0">Your restaurant have no gallery</span>
          </p>
        </div>
      </div>

      <div class="row">
        <div>
          <p class="field">Menu</p>
          <div style="margin-top: 10px;">
            <menu [menu]="restaurant.menu" [currency]="restaurant.currency"></menu>
          </div>
        </div>
      </div>

      <div class="row">
        <div style="margin-top: 10px;">
          <p class="field">Events</p>
          <div class="event" *ngFor="let e of restaurant.events">
            <img [src]="e.poster.url" [alt]="e.poster.name" />
            <div class="event-infor">
              <div>
                <h5 style="margin-bottom: 20px;">{{ e.name }}</h5>
                <p style="margin-bottom: 10px;"><b>Description:</b> {{ e.desc }}</p>
                <p><b>End date:</b> {{ e.endDate | date : 'dd/MM/yyyy' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      .row {
        @include flex(row, flex-start, space-between);
        margin: 0 0 16px;
        & > * {
          padding: 0;
          flex: 1;
        }
      }
      [contentEditable='true'] {
        display: inline-block;
        border: 1px dashed $primary;
        padding: 0 4px;
        background: $primary--blur;
        border-radius: 4px;
        outline-color: $primary;
      }
      .field {
        color: #aaa;
        margin-bottom: 2px;
      }
      .value {
        font-size: 18px;
        text-align: justify;
        a {
          display: flex;
        }
        .image-icon {
          margin-right: 4px;
        }
      }

      .event {
        display: flex;
        gap: 20px;
        margin-top: 10px;

        img {
          @include img-fit(500px);
        }

        .event-infor {
          @include flex(column, flex-start, space-between);

          p {
            @include ellipsis(4);
          }
        }
      }
    `,
  ],
})
export class MetadataRestaurantComponent {
  @Input() restaurant!: IRestaurant;
}
