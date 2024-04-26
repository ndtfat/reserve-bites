import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ionImage } from '@ng-icons/ionicons';
import {
  IFormOwnerInformationType,
  IFormRestaurantInformationType,
} from 'src/app/types/restaurant.type';
import { MenuComponent } from '../../restaurant/components/menu.component';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirmation-restaurant-register',
  standalone: true,
  imports: [NgFor, MatDividerModule, NgIconsModule, MenuComponent, TimePipe, MatButtonModule],
  viewProviders: [provideIcons({ ionImage })],
  styles: [
    `
      @import '../../../../scss/common.scss';
      .title {
        @include flex(row, flex-end, flex-start);
        margin-top: 20px;
        margin-bottom: 16px;
        h4 {
          font-size: 20px;
          font-weight: bold;
          margin-right: 10px;
        }
      }
      .button-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
        button:first-child {
          margin-right: 20px;
        }
      }
      .row {
        @include flex(row, center, space-between);
        margin-bottom: 16px;
        & > * {
          flex: 1;
        }
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
    `,
  ],
  template: `
    <h3>Please confirm these information before create your restaurant</h3>

    <!-- Owner -->
    <span>
      <div class="title">
        <h4>Owner information</h4>
        <mat-divider style="flex: 1" />
      </div>
      <div class="row">
        <div>
          <p class="field">First name</p>
          <p class="value">{{ ownerInfo.firstName }}</p>
        </div>
        <div>
          <p class="field">Last name</p>
          <p class="value">{{ ownerInfo.lastName }}</p>
        </div>
        <div>
          <p class="field">Email</p>
          <p class="value">{{ ownerInfo.email }}</p>
        </div>
      </div>
    </span>

    <!-- Restaurant -->
    <span>
      <div class="title">
        <h4>Restaurant information</h4>
        <mat-divider style="flex: 1" />
      </div>
      <div class="row">
        <div>
          <p class="field">Restaurant name</p>
          <p class="value">{{ resInfo.name }}</p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Description</p>
          <p class="value">
            {{ resInfo.description }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Address</p>
          <p class="value">
            {{ resInfo.address.detail }} - {{ resInfo.address.province }} -
            {{ resInfo.address.country }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Operation time</p>
          <p class="value">
            {{ resInfo.operationTime.openTime | time }} ~
            {{ resInfo.operationTime.closeTime | time }}
          </p>
        </div>
        <div>
          <p class="field">Operation day(s)</p>
          <p class="value">
            {{
              resInfo.operationTime.openDay.length === 7
                ? 'All day of week'
                : resInfo.operationTime.openDay.join(', ')
            }}
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Main iamge</p>
          <p class="value">
            <a [href]="resInfo.mainImage.url">
              <ng-icon name="ionImage" class="image-icon" />
              {{ resInfo.mainImage.name }}
            </a>
          </p>
        </div>
      </div>
      <div class="row">
        <div>
          <p class="field">Gallery</p>
          <p class="value gallery">
            <a *ngFor="let img of resInfo.gallery" [href]="img.url">
              <ng-icon name="ionImage" class="image-icon" /> {{ img.name }}
            </a>
          </p>
        </div>
      </div>
    </span>

    <!-- Menu -->
    <span>
      <div class="title">
        <h4>Menu</h4>
        <mat-divider style="flex: 1" />
      </div>
      <menu [menu]="resInfo.menu" [currency]="resInfo.currency"></menu>
    </span>

    <!-- Buttons -->
    <div class="button-wrapper">
      <button type="button" mat-raised-button (click)="back.emit()">Back</button>
      <button type="button" mat-raised-button color="primary" (click)="confirm.emit()">
        Create restaurant
      </button>
    </div>
  `,
})
export class ConfirmationRestaurantRegisterComponent implements OnInit {
  @Input() ownerInfo!: IFormOwnerInformationType;
  @Input() resInfo!: IFormRestaurantInformationType;
  @Output() back = new EventEmitter();
  @Output() confirm = new EventEmitter();

  ngOnInit(): void {}
}
