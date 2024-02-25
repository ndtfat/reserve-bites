import { Component } from '@angular/core';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  IFormOwnerInformationType,
  IFormRestaurantInformationType,
} from 'src/app/types/restaurant.type';

@Component({
  selector: 'restaurant-register',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';

      .wrapper {
        margin: 50px;
        padding: 20px;
        border-radius: 4px;
        @include shadow;

        .logo {
          display: block;
          margin: 0 auto;
          width: 50px;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
          margin-top: 10px;
        }
      }

      @include desktop {
        .wrapper {
          max-width: $body-width;
          margin: 50px auto;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <img
        routerLink="/"
        class="logo"
        src="../../../assets/logos/logo--black.svg"
        alt="logo"
      />
      <h1>Restaurant Register</h1>
      <mat-stepper linear [selectedIndex]="step">
        <mat-step>
          <ng-template matStepLabel>Owner Information</ng-template>
          <form-owner-information (onSubmit)="handleNextStep($event)" />
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Restaurant Information</ng-template>
          <form-restaurant-information
            submitButtonName="Next"
            (back)="handleBack()"
            (submit)="handleNextStep($event)"
          />
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Confirmation</ng-template>
          <confirmation-restaurant-register
            *ngIf="ownerInformation && restaurantInformation"
            (back)="handleBack()"
            (confirm)="handleNextStep()"
            [ownerInfo]="ownerInformation"
            [resInfo]="restaurantInformation"
          />
        </mat-step>
      </mat-stepper>
    </div>
  `,
})
export class RestaurantRegisterComponent {
  constructor(private restaurantSv: RestaurantService) { }

  step: number = 0;
  ownerInformation: IFormOwnerInformationType | undefined;
  restaurantInformation: IFormRestaurantInformationType | undefined;

  handleNextStep(
    data?: IFormOwnerInformationType | IFormRestaurantInformationType
  ) {
    switch (this.step) {
      case 0:
        this.ownerInformation = data as IFormOwnerInformationType;
        this.step = 1;
        break;
      case 1:
        this.restaurantInformation = data as IFormRestaurantInformationType;
        this.step = 2;
        break;
      case 2:
        if (this.ownerInformation && this.restaurantInformation)
          this.restaurantSv.register({
            owner: this.ownerInformation,
            restaurant: this.restaurantInformation,
          });
        break;
    }
  }

  handleBack() {
    this.step = this.step - 1;
  }
}
