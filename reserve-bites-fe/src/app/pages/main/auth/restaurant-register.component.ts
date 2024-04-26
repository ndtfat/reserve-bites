import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { LogoComponent } from 'src/app/components/common/logo.component';
import { ConfirmationRestaurantRegisterComponent } from 'src/app/pages/main/auth/components/confirmation-restaurant-register.component';
import { FormOwnerInformationComponent } from 'src/app/pages/components/forms/form-owner-information.component';
import { FormRestaurantInformationComponent } from 'src/app/pages/components/forms/form-restaurant-information.component';
import { RestaurantService } from 'src/app/services/restaurant.service';
import {
  IFormOwnerInformationType,
  IFormRestaurantInformationType,
} from 'src/app/types/restaurant.type';

@Component({
  selector: 'restaurant-register',
  standalone: true,
  imports: [
    NgIf,
    LogoComponent,
    MatStepperModule,
    FormOwnerInformationComponent,
    FormRestaurantInformationComponent,
    ConfirmationRestaurantRegisterComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';

      .wrapper {
        padding: 30px 20px 0;
        border-radius: 4px;
        @include shadow;
        background: #fff;
        width: min(1000px, 70vw);

        .logo {
          display: flex;
          justify-content: center;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
          margin-top: 10px;
        }
      }

      @include desktop {
        .wrapper {
          margin: 30px auto 0;
        }
      }

      @include mobile {
        .wrapper {
          margin: 30px auto;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <logo class="logo" [text]="true" width="140px" />
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
  constructor(private restaurantSv: RestaurantService) {}

  step: number = 0;
  ownerInformation: IFormOwnerInformationType | undefined;
  restaurantInformation: IFormRestaurantInformationType | undefined;

  handleNextStep(data?: IFormOwnerInformationType | IFormRestaurantInformationType) {
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
