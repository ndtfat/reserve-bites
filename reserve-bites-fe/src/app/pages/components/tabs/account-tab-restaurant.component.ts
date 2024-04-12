import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { MenuComponent } from '../../main/restaurant/components/menu.component';
import { FormCreateEventComponent } from '../forms/form-create-event.component';
import { FormRestaurantInformationComponent } from '../forms/form-restaurant-information.component';
import { MetadataRestaurantComponent } from '../metadata/metadata-restaurant.component';

enum Mode {
  View = 'view',
  Edit = 'edit',
  Create_Event = 'create-event',
}

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
    FormCreateEventComponent,
    MatProgressSpinnerModule,
    MetadataRestaurantComponent,
    FormRestaurantInformationComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      .wrapper {
        margin: 20px 0;
        background: #fff;
      }
      .button {
        display: flex;
        align-items: center;
        gap: 10px;
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
            {{
              mode === Mode.View
                ? 'Restaurant information'
                : mode === Mode.Edit
                ? 'Edit restaurant'
                : 'Create event'
            }}
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

        <div style="display: flex; gap: 10px;">
          <button *ngIf="mode === Mode.View" mat-raised-button (click)="mode = Mode.Create_Event">
            <div class="button">
              <ng-icon name="matModeEditOutline" size="1.4rem" />
              <span>Create event</span>
            </div>
          </button>
          <button
            *ngIf="mode === Mode.View"
            mat-raised-button
            color="primary"
            (click)="mode = Mode.Edit"
          >
            <div class="button">
              <ng-icon name="matModeEditOutline" size="1.4rem" />
              <span>Edit</span>
            </div>
          </button>
          <button
            *ngIf="mode === Mode.Edit || mode === Mode.Create_Event"
            mat-raised-button
            color="warn"
            (click)="mode = Mode.View"
          >
            <div class="button">
              <ng-icon name="matCloseOutline" size="1.4rem" />
              <span>Cancel</span>
            </div>
          </button>
        </div>
      </div>

      <div *ngIf="restaurant">
        <metadata-restaurant *ngIf="mode === Mode.View" [restaurant]="restaurant" />

        <form-create-event *ngIf="mode === Mode.Create_Event" />

        <form-restaurant-information
          *ngIf="mode === Mode.Edit"
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
  restaurant!: IRestaurant;
  editedData: any;
  Mode = Mode;
  mode: Mode = Mode.View;

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
      this.mode = Mode.View;
      this._snackbar.open('success', 'You have updated restaurant successfully!');
    }
  }
}
