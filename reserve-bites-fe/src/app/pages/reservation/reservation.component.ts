import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IReservation, IRestaurant, ReservationStatus } from 'src/app/types/restaurant.type';
import { RealTimeService } from 'src/app/services/realTime.service';
import { validReservation } from 'src/app/utils/reservation';
import { from } from 'rxjs';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matOpenInNewOutline } from '@ng-icons/material-icons/outline';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'reservation',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    TimePipe,
    RouterLink,
    NgIconsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  viewProviders: [provideIcons({ matOpenInNewOutline })],

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

      .confirmed,
      .completed {
        color: #1f931e;
        background-color: #e9f6e9;
      }
      .responding {
        color: #e69216;
        background-color: #fff6e8;
      }
      .canceled {
        color: #c51d1a;
        background-color: #fbe9e8;
      }
      .expired,
      .rejected {
        color: #333;
        background-color: #eee;
      }
      .btns {
        gap: 10px;
        margin-top: 20px;
        @include flex(row, flex-end, flex-end);
      }

      @include mobile {
        .body {
          margin: 0 20px;
        }
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
        .body {
          margin: 0 50px;
        }
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

      @include desktop {
        .body {
          width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <!-- <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" /> -->
    <img src="../../../assets/backgrounds/reservation.png" alt="reservation-bg" />
    <div class="body">
      <span *ngIf="reservation">
        <div>
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
        </div>

        <div *ngIf="reservation.status !== 'confirmed' || !isOwner" class="btns">
          <button
            mat-raised-button
            (click)="isOwner ? responseReservation(ReservationStatus.CONFIRMED) : openEditDialog()"
          >
            {{ isOwner ? 'Confirm' : 'Edit' }}
          </button>
          <button
            mat-raised-button
            color="warn"
            (click)="isOwner ? responseReservation(ReservationStatus.REJECTED) : openCancelDialog()"
          >
            {{ isOwner ? 'Reject' : 'Cancel' }}
          </button>
        </div>
      </span>

      <mat-spinner *ngIf="!reservation" />
    </div>
  `,
})
export class ReservationComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute,
    private restaurantSv: RestaurantService,
  ) {
    this.auth.user.subscribe((u) => {
      this.isOwner = !!u?.isOwner;
    });
  }
  isOwner = false;
  reservation!: IReservation;
  ReservationStatus = ReservationStatus;

  async ngOnInit() {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const res = await this.restaurantSv.getReservationById(id);
        this.reservation = res;
      }
    }
  }

  openCancelDialog() {
    this.dialog.open(CancelReservationDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
  }
  openEditDialog() {
    this.dialog.open(EditReservationDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: this.reservation,
    });
  }
  async responseReservation(status: 'confirmed' | 'rejected') {
    await this.restaurantSv.responseReservation(this.reservation, status).then(() => {
      this.reservation.status = status as ReservationStatus;
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
class CancelReservationDialog {
  constructor(public dialogRef: MatDialogRef<CancelReservationDialog>) {}
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
    FormsModule,
    CommonModule,
    AlertComponent,
    MatInputModule,
    MatButtonModule,
    TimepickerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
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

      <alert type="error" *ngIf="alertMessage" style="margin-bottom: 10px;">
        {{ alertMessage }}
      </alert>

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
class EditReservationDialog {
  constructor(
    public dialogRef: MatDialogRef<EditReservationDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IReservation,
  ) {}

  alertMessage = '';
  form = this.fb.group({
    size: [this.data.size, Validators.required],
    time: [this.data.time, Validators.required],
    date: [this.data.date, Validators.required],
  });

  handleClose() {
    this.dialogRef.close();
  }
  handleEdit() {
    const size = Number(this.form.get('size')?.value);

    this.alertMessage = validReservation(
      size,
      this.form.get('date')?.value as Date,
      this.form.get('time')?.value as Date,
      this.data.restaurant.operationTime.openTime,
      this.data.restaurant.operationTime.closeTime,
      this.data.restaurant.maxReservationSize,
      this.data.restaurant.operationTime.openDay,
    );

    if (this.alertMessage === '') {
      console.log(this.form.value);
    }
  }
}
