import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matOpenInNewOutline } from '@ng-icons/material-icons/outline';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { IReservation } from 'src/app/types/restaurant.type';

@Component({
  selector: 'metadata-reservation',
  standalone: true,
  imports: [NgIconsModule, RouterLink, MatDividerModule, DatePipe, TimePipe],
  viewProviders: [provideIcons({ matOpenInNewOutline })],
  template: `<div>
      <h2 [style]="{ fontWeight: 'bold' }">{{ reservation.restaurant.name }}</h2>
      <p
        [routerLink]="'/restaurant/' + reservation.restaurant.id"
        [style]="{
          display: 'flex',
          gap: '4px',
          color: 'blue',
          cursor: 'pointer',
          marginTop: '6px'
        }"
      >
        <ng-icon name="matOpenInNewOutline" /> View restaurant
      </p>
    </div>
    <mat-divider style="margin-top: 10px; margin-bottom: 20px;" />
    <div class="detail">
      <div class="fields-wrapper">
        <div>
          <p class="field">Status</p>
          <p [class]="'value ' + reservation.status" style="font-weight: bold;">
            {{ reservation.status }}
          </p>
        </div>
        <div>
          <p class="field">Number of diners</p>
          <p class="value">{{ reservation.size }}</p>
        </div>
        <div>
          <p class="field">Date</p>
          <p class="value">{{ reservation.date | date : 'dd/MM/YYYY' }}</p>
        </div>
        <div>
          <p class="field">Time</p>
          <p class="value">{{ reservation.time | time }}</p>
        </div>
        <div>
          <p class="field">Address</p>
          <p class="value">
            {{
              reservation.restaurant.address.detail +
                ', ' +
                reservation.restaurant.address.province +
                ', ' +
                reservation.restaurant.address.country
            }}
          </p>
        </div>
      </div>
      <div class="fields-wrapper">
        <div>
          <p class="field">First name</p>
          <p class="value">{{ reservation.diner.firstName }}</p>
        </div>
        <div>
          <p class="field">Last name</p>
          <p class="value">{{ reservation.diner.lastName }}</p>
        </div>
        <div>
          <p class="field">Email</p>
          <p class="value">{{ reservation.diner.email }}</p>
        </div>
      </div>
    </div>`,
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/responsive.scss';

      .fields-wrapper {
        flex: 1;

        & > div {
          @include flex(row, flex-start, flex-start);
          margin-bottom: 10px;

          .field {
            font-weight: 600;
          }
          .value {
            flex: 1;
          }
        }
      }

      .value {
        @include status;
      }

      .btns {
        gap: 10px;
        margin-top: 20px;
        @include flex(row, flex-end, flex-end);
      }

      @include mobile {
        .detail {
          @include flex(column, flex-start, flex-start);
          gap: 10px;
        }
        .fields-wrapper {
          flex-basis: 100px;

          & > div .field {
            flex-basis: 130px;
          }
        }
      }

      @include tablet {
        .detail {
          @include flex(row, flex-start, flex-start);
          gap: 30px;
        }
        .fields-wrapper {
          flex-basis: 360px;

          & > div .field {
            flex-basis: 160px;
          }
        }
      }
    `,
  ],
})
export class MetadataReservationComponent {
  @Input() reservation!: IReservation;
}
