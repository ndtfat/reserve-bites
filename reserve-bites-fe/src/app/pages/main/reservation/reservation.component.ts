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
import { validReservation } from 'src/app/utils/form';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { matOpenInNewOutline } from '@ng-icons/material-icons/outline';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { IReservation, ReservationStatus } from 'src/app/types/restaurant.type';
import { UserService } from 'src/app/services/user.service';
import { TableReservationVersionsComponent } from 'src/app/pages/components/tables/table-reservation-versions.component';
import { RealTimeService } from 'src/app/services/realTime.service';
import { NotificationType } from 'src/app/types/notification';
import { DialogReservationCancelComponent } from '../../components/dialogs/dialog-reservation-cancel.component';
import { FormReservationComponent } from '../../components/forms/form-reservation.component';
import { DialogReservationEditComponent } from '../../components/dialogs/dialog-reservation-edit.component';
import { ReservationMetadataComponent } from './components/reservation-metadata.component';

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
    ReservationMetadataComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
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

      .btns {
        gap: 10px;
        margin-top: 20px;
        @include flex(row, flex-end, flex-end);
      }

      @include mobile {
        .body {
          margin: 0 20px;
        }
      }

      @include tablet {
        .body {
          margin: 0 50px;
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
        <reservation-metadata [reservation]="reservation" />

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
    const cancelDialogRef = this.dialog.open(DialogReservationCancelComponent, {
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
    const editReservationRef = this.dialog.open(DialogReservationEditComponent, {
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
