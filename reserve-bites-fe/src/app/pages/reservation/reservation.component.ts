import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { MatInputModule } from '@angular/material/input';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatDividerModule } from '@angular/material/divider';
import { validReservation } from 'src/app/utils/reservation';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { matOpenInNewOutline } from '@ng-icons/material-icons/outline';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { IReservation, ReservationStatus } from 'src/app/types/restaurant.type';
import { UserService } from 'src/app/services/user.service';
import { TableReservationVersionsComponent } from 'src/app/components/reservation/table-reservation-versions.component';
import { RealTimeService } from 'src/app/services/realTime.service';
import { NotificationType } from 'src/app/types/notification';

@Component({
  selector: 'reservation',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    TimePipe,
    RouterLink,
    NgIconsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TableReservationVersionsComponent,
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

      .value {
        @include status;
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

        <div
          *ngIf="
            (reservation.status !== 'confirmed' || !isOwner) &&
            reservation.status !== 'canceled' &&
            reservation.status !== 'rejected'
          "
          class="btns"
        >
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

        <mat-divider
          *ngIf="reservation.status === 'canceled'"
          style="margin-top: 20px; margin-bottom: 10px;"
        />
        <div *ngIf="reservation.status === 'canceled'">
          <h5 style="margin-bottom: 10px;">Cancel message</h5>
          <div style="display: flex; justify-content: space-between;">
            <p>
              {{ reservation.cancelMessage.message }}
            </p>
            <p>{{ reservation.cancelMessage.createdAt | date : 'dd/MM/yyyy' }}</p>
          </div>
        </div>

        <mat-divider
          *ngIf="reservation.versions.length > 0"
          style="margin-top: 20px; margin-bottom: 10px;"
        />
        <div class="versions" *ngIf="reservation.versions.length > 0">
          <h5 style="margin-bottom: 10px;">Previous verisons</h5>
          <table-reservation-versions [dataSource]="reservation.versions" />
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
    private realtime: RealTimeService,
    private restaurantSv: RestaurantService,
  ) {
    this.auth.user.subscribe((u) => {
      this.isOwner = !!u?.isOwner;
    });
  }
  isOwner = false;
  reservation!: IReservation;
  ReservationStatus = ReservationStatus;

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('id')) {
      this.route.params.subscribe(({ id }) => {
        if (id) {
          this.restaurantSv.getReservationById(id).then((res) => (this.reservation = res));
        }
      });
    }
    this.realtime.receiveNotification().subscribe((notif) => {
      if (
        notif.type === NotificationType.UPDATE_RESERVATION ||
        notif.type === NotificationType.CANCEL_RESERVATION ||
        notif.type === NotificationType.REJECT_RESERVATION ||
        notif.type === NotificationType.CONFIRM_RESERVATION
      ) {
        this.restaurantSv
          .getReservationById(notif.additionalInfo.reservationId as string)
          .then((res) => (this.reservation = res));
      }
    });
  }

  openCancelDialog() {
    const cancelDialogRef = this.dialog.open(CancelReservationDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: this.reservation,
    });

    cancelDialogRef.afterClosed().subscribe((updatedReservation) => {
      if (updatedReservation) {
        this.reservation = updatedReservation;
      }
    });
  }
  openEditDialog() {
    const editReservationRef = this.dialog.open(EditReservationDialog, {
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: this.reservation,
    });

    editReservationRef.afterClosed().subscribe((updatedReservation) => {
      if (updatedReservation) {
        this.reservation = updatedReservation;
      }
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
        margin-top: 10px;
        @include flex(row, flex-end, flex-end);
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>Cancel reservation</h2>
      <p style="margin-bottom: 16px;">Why you want to cancel this reservation?</p>
      <mat-form-field style="width: 100%;" appearance="outline">
        <mat-label>Message to restaurant</mat-label>
        <textarea #textarea matInput rows="3" (input)="message = textarea.value"></textarea>
      </mat-form-field>
      <p style="color: red;">{{ errorMessage }}</p>
      <div class="btns">
        <button mat-raised-button (click)="handleClose(null)">Cancel</button>
        <button mat-raised-button color="warn" (click)="handleSend()" [disabled]="!message">
          Send
        </button>
      </div>
    </div>
  `,
})
class CancelReservationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IReservation,
    public dialogRef: MatDialogRef<CancelReservationDialog>,
    private userSv: UserService,
  ) {}
  message: string = '';
  errorMessage = '';

  handleClose(data: IReservation | null) {
    this.dialogRef.close(data);
  }
  handleSend() {
    if (this.message) {
      // this.handleClose();
      this.userSv
        .updateReservation({
          request: 'cancel',
          reservationId: this.data.id,
          rid: this.data.restaurant.id,
          cancelMessage: this.message,
        })
        .then((res) => {
          this.handleClose(res);
        });
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
    ReactiveFormsModule,
    MatDatepickerModule,
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

      <alert type="error" *ngIf="alertMessage">
        {{ alertMessage }}
      </alert>

      <form [formGroup]="form" style="margin-top: 16px;">
        <mat-form-field style="width: 100%;" appearance="outline">
          <mat-label>Size</mat-label>
          <input matInput formControlName="size" type="number" />
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
        <button mat-raised-button (click)="handleClose(null)">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="handleEdit()"
          [disabled]="!isDataChanged"
        >
          Edit
        </button>
      </div>
    </div>
  `,
})
class EditReservationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IReservation,
    public dialogRef: MatDialogRef<EditReservationDialog>,
    private fb: FormBuilder,
    private userSv: UserService,
  ) {
    this.form.valueChanges.subscribe((value) => {
      const root = { size: data.size, time: new Date(data.time), date: new Date(data.date) };
      this.isDataChanged = JSON.stringify(value) !== JSON.stringify(root);
    });
  }

  isDataChanged = false;
  alertMessage = '';
  form = this.fb.group({
    size: [this.data.size, Validators.required],
    time: [new Date(this.data.time), Validators.required],
    date: [new Date(this.data.date), Validators.required],
  });

  handleClose(data: IReservation | null) {
    this.dialogRef.close(data);
  }
  handleEdit() {
    const size = Number(this.form.get('size')?.value);
    const date = this.form.get('date')?.value as Date;
    const time = this.form.get('time')?.value as Date;

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
      this.userSv
        .updateReservation({
          reservationId: this.data.id,
          date,
          time,
          size,
          request: 'update',
          rid: this.data.restaurant.id,
        })
        .then((res) => {
          this.handleClose(res);
        });
    }
  }
}
