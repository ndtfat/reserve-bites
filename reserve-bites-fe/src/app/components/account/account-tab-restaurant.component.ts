import { Component, OnInit } from '@angular/core';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from '../restaurant/menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormRestaurantInformationComponent } from '../restaurant-register/form-restaurant-information.component';

@Component({
  selector: 'account-tab-restaurant',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TimePipe,
    RouterLink,
    MenuComponent,
    NgIconsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormRestaurantInformationComponent,
  ],
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper {
        margin: 20px 0;
        background: #fff;
      }
      .edit-button {
        display: flex;
        align-items: center;
        gap: 10px;
      }
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
    `,
  ],
  template: `
    <div class="wrapper container">
      <div
        [style]="{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px'
        }"
      >
        <div>
          <h4 [style]="{ fontSize: '30px', fontWeight: 'bold' }">
            {{ editting ? 'Edit Restaurant' : 'Restaurant information' }}
          </h4>
          <p
            *ngIf="restaurant"
            [routerLink]="'/restaurant/' + restaurant.id"
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

        <button mat-raised-button [color]="editting ? 'warn' : ''" (click)="editting = !editting">
          <div class="edit-button">
            <ng-icon [name]="editting ? 'matCloseOutline' : 'matModeEditOutline'" size="1.4rem" />
            <span>{{ editting ? 'Cancel' : 'Edit' }}</span>
          </div>
        </button>
      </div>

      <div *ngIf="restaurant && !editting">
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
        </div>
      </div>

      <div *ngIf="restaurant && editting">
        <form-restaurant-information
          [backButton]="false"
          submitButtonName="Save change"
          [restaurantInfo]="restaurant"
          (submit)="handleSaveEdit($event)"
        />
      </div>
      <mat-spinner *ngIf="!restaurant" />
    </div>
  `,
})
export class AccountTabRestaurantComponent implements OnInit {
  editting = false;
  restaurant!: IRestaurant;
  editedData: any;
  dayOptions = ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
    (day) => {
      return { value: day, content: day };
    },
  );

  constructor(
    private auth: AuthService,
    private restaurantSv: RestaurantService,
    private _snackbar: SnackbarService,
  ) {}

  ngOnInit() {
    const rid = this.auth.user.value?.rid;
    if (rid) {
      this.restaurantSv.getRestaurant(rid).subscribe((response) => {
        this.restaurant = response;
      });
    }
  }

  async handleSaveEdit(payload: any) {
    if (!payload?.target) {
      const response = await this.restaurantSv.update(payload);
      this.restaurant = response as IRestaurant;
      this.editting = false;
      this._snackbar.open('success', 'You have updated restaurant successfully!');
    }
  }
}
