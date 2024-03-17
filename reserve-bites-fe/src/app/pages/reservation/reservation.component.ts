import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IRestaurant } from 'src/app/types/restaurant.type';

@Component({
  selector: 'reservation',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      img {
        @include img-fit(100vw, 300px);
      }
      .body {
        @include shadow;
        background: #fff;
        border-radius: 4px;
        padding: 20px 30px;
        transform: translateY(-50px);
      }
      .restaurant-name {
        @include flex(row, center, space-between);
        h2 {
          font-weight: bold;
        }
        p {
          @include flex(row, center, space-between);
          &:hover {
            @include cursor;
            color: $primary;
          }
        }
      }
      .detail,
      .reservation,
      .user {
        @include flex(row, flex-start, flex-start);
      }
      .detail {
        gap: 70px;
        padding: 0 40px;
      }
      .reservation,
      .user {
        gap: 30px;
        font-size: 18px;
        .field p {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .value p {
          margin-bottom: 10px;
          &.confirmed {
            color: #1f931e;
            background-color: #e9f6e9;
          }
          &.responding {
            color: #e69216;
            background-color: #fff6e8;
          }
          &.canceled {
            color: #c51d1a;
            background-color: #fbe9e8;
          }
          &.completed {
            color: #333;
            background-color: #eee;
          }
        }
      }
      .sub-text {
        font-weight: 500;
        padding-left: 40px;
        margin-bottom: 10px;
      }
      .btns {
        gap: 10px;
        margin-top: 20px;
        @include flex(row, flex-end, flex-end);
      }

      @include desktop {
        .body {
          width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" />
    <div class="body">
      <div class="restaurant-name">
        <h2>{{ restaurant.name }}</h2>
        <p *ngIf="!isOwner" [routerLink]="'/restaurant/' + restaurant.id">
          Restaurant detail <mat-icon>keyboard_arrow_right</mat-icon>
        </p>
      </div>
      <mat-divider style="margin-top: 10px; margin-bottom: 20px;" />
      <div class="sub-text-wrapper">
        <p class="sub-text">Restaurant will respond to you soon ❤</p>
      </div>
      <div class="detail">
        <div class="reservation">
          <div class="field">
            <p>Status</p>
            <p>Number of diners</p>
            <p>Date</p>
            <p>Time</p>
            <p>Address</p>
          </div>
          <div class="value">
            <p class="responding" style="font-weight: bold;">Responding</p>
            <p>2</p>
            <p>August, 26th 2002</p>
            <p>19:00</p>
            <p>
              {{
                restaurant.address.detail +
                  ', ' +
                  restaurant.address.province +
                  ', ' +
                  restaurant.address.country
              }}
            </p>
          </div>
        </div>
        <div class="user">
          <div class="field">
            <p>First name</p>
            <p>Last name</p>
            <p>Email</p>
          </div>
          <div class="value">
            <p>Phat</p>
            <p>Nguyen</p>
            <p>phatnguyen&#64;gmail.com</p>
          </div>
        </div>
      </div>

      <div class="btns">
        <button mat-raised-button (click)="openEditDialog()">Edit</button>
        <button mat-raised-button color="warn" (click)="openCancelDialog()">Cancel</button>
      </div>
    </div>
  `,
})
export class ReservationComponent {
  constructor(public dialog: MatDialog) {}

  isOwner = false;
  restaurant: IRestaurant = {
    id: '1',
    name: 'Bun bo di` 2',
    description: 'Bun bo di 2 always serve the best "Bun Bo" for buyers.',
    owner: {
      id: '',
      email: '',
      isOwner: true,
      lastName: 'Nguyen',
      firstName: 'Phat',
    },
    address: {
      detail: 'Hem 114',
      province: 'Dong Nai',
      country: 'Viet Nam',
    },
    currency: 'VND',
    menu: [
      {
        category: 'Soup',
        dishes: [
          { name: 'Bun bo dac biet', price: 50000 },
          { name: 'Bun bo`', price: 25000 },
          { name: 'HU tieu', price: 20000 },
        ],
      },
      {
        category: 'Soup',
        dishes: [
          { name: 'Bun bo dac biet', price: 50000 },
          { name: 'Bun bo`', price: 25000 },
          { name: 'HU tieu', price: 20000 },
        ],
      },
    ],
    operationTime: {
      openTime: '07:00',
      closeTime: '19:00',
      openDay: ['Monday', 'Wednesday'],
    },
    maxReservationSize: 4,
    mainImage: {
      id: '',
      name: 'bun bo',
      url: 'https://static.vinwonders.com/production/bun-bo-da-lat-banner.jpg',
    },
    gallery: [
      {
        id: '',
        name: 'bun bo',
        url: 'https://static.vinwonders.com/production/bun-bo-da-lat-banner.jpg',
      },
      {
        id: '',
        name: 'bun bo',
        url: 'https://img-global.cpcdn.com/recipes/6824738c264d979d/1200x630cq70/photo.jpg',
      },
    ],
    rate: 4,
  };

  openCancelDialog(): void {
    this.dialog.open(CancelDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
  }
  openEditDialog() {
    this.dialog.open(EditDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
  }
}

@Component({
  selector: 'cancel-reservation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        min-height: 10px;
        min-width: 600px;
        padding: 20px;
      }
      h2 {
        font-weight: bold;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 10px;
      }
      .btns {
        gap: 10px;
        margin-top: 20px;
        @include flex(row, flex-end, flex-end);
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>Cancel reservation</h2>
      <p>Why you want to cancel this reservation?</p>
      <mat-form-field style="width: 100%;" appearance="outline">
        <mat-label>Message to restaurant</mat-label>
        <textarea #textarea matInput rows="3" (input)="message = textarea.value"></textarea>
      </mat-form-field>
      <p style="color: red;">{{ errorMessage }}</p>
      <div class="btns">
        <button mat-raised-button (click)="handleClose()">Cancel</button>
        <button mat-raised-button color="warn" (click)="handleSend()">Send</button>
      </div>
    </div>
  `,
})
class CancelDialog {
  constructor(public dialogRef: MatDialogRef<CancelDialog>) {}
  message: string = '';
  errorMessage = '';

  handleClose() {
    this.dialogRef.close();
  }
  handleSend() {
    if (this.message) {
      this.handleClose();
      console.log(this.message);
    } else {
      this.errorMessage = 'Please type your reason';
    }
  }
}

//
@Component({
  selector: 'edit-reservation-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TimepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        min-height: 10px;
        min-width: 600px;
        padding: 20px;
      }
      h2 {
        font-weight: bold;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 10px;
      }
      .btns {
        gap: 10px;
        margin-top: 10px;
        @include flex(row, flex-end, flex-end);
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>Edit reservation</h2>

      <form [formGroup]="form">
        <mat-form-field style="width: 100%;" appearance="outline">
          <mat-label>Size</mat-label>
          <input matInput formControlName="size" />
        </mat-form-field>

        <mat-form-field style="width: 100%" appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        <span style="display:flex; align-items: center">
          <h6 style="margin-right: 10px; font-weight: 600">Time:</h6>
          <timepicker
            [hourStep]="1"
            [minuteStep]="1"
            [showMeridian]="false"
            formControlName="time"
          />
        </span>
      </form>

      <div class="btns">
        <button mat-raised-button (click)="handleClose()">Cancel</button>
        <button mat-raised-button color="primary" (click)="handleEdit()">Edit</button>
      </div>
    </div>
  `,
})
class EditDialog {
  constructor(public dialogRef: MatDialogRef<EditDialog>, private fb: FormBuilder) {}
  form = this.fb.group({
    size: [1],
    time: [new Date()],
    date: [new Date()],
  });

  handleClose() {
    this.dialogRef.close();
  }
  handleEdit() {
    // this.handleClose();
    console.log(this.form.value);
  }
}
