import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IReservation, IRestaurant } from 'src/app/types/restaurant.type';
import { validReservation } from 'src/app/utils/form';
import { AlertComponent } from '../../../components/common/alert.component';
import { FormInputComponent } from '../../../components/common/form-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'form-reservation',
  standalone: true,
  imports: [
    NgIf,
    MatInputModule,
    AlertComponent,
    MatButtonModule,
    TimepickerModule,
    FormInputComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      form {
        width: 100%;
      }
      .overlay {
        @include overlayLock;
      }
      .edit-btns {
        gap: 10px;
        margin-top: 10px;
        @include flex(row, flex-end, flex-end);
      }
    `,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <alert type="error" *ngIf="alertMessage" style="margin-bottom: 10px;">
        {{ alertMessage }}
      </alert>
      <form-input
        [formGroup]="form"
        [label]="'Size - maximum ' + restaurant.maxReservationSize"
        name="size"
        type="number"
        [max]="restaurant.maxReservationSize"
        appearance="fill"
      />
      <mat-form-field style="width: 100%">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" />
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-datepicker #picker />
      </mat-form-field>

      <span style="display:flex; align-items: center">
        <h6 style="margin-right: 10px; font-weight: 600">Time:</h6>
        <timepicker formControlName="time" [hourStep]="1" [minuteStep]="1" [showMeridian]="false" />
      </span>

      <button
        *ngIf="mode === 'create'"
        mat-raised-button
        color="primary"
        style="width:100%; margin-top: 10px"
        [disabled]="reserving"
      >
        Reserve
      </button>

      <div class="edit-btns" *ngIf="mode === 'update'">
        <button type="button" mat-raised-button (click)="afterSubmitted.emit(null)">Cancel</button>
        <button mat-raised-button color="primary" [disabled]="!isDataChanged">Edit</button>
      </div>
    </form>
  `,
})
export class FormReservationComponent implements OnInit {
  @Input() restaurant!: IRestaurant;
  @Input() reservation?: IReservation;
  @Output() afterSubmitted = new EventEmitter();

  form = this.fb.group({
    size: [1, Validators.required],
    date: [new Date(), Validators.required],
    time: [new Date(), Validators.required],
  });
  mode = 'create';
  reserving = false;
  alertMessage = '';
  isDataChanged = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userSv: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.mode = this.router.url.includes('reservation') ? 'update' : 'create';
    if (this.mode === 'update' && this.reservation) {
      this.form = this.fb.group({
        size: [this.reservation.size, Validators.required],
        time: [new Date(this.reservation.time), Validators.required],
        date: [new Date(this.reservation.date), Validators.required],
      });
    }

    this.form.valueChanges.subscribe((value) => {
      this.alertMessage = '';
      if (this.reservation) {
        const { size, date, time } = this.reservation;
        const root = { size: size, time: new Date(time), date: new Date(date) };

        this.isDataChanged =
          JSON.stringify({ ...value, size: Number(value.size) }) !== JSON.stringify(root);
      }
    });
  }

  async handleSubmit() {
    const size = Number(this.form.get('size')?.value);
    const date = this.form.value.date as Date;
    const time = this.form.value.time as Date;

    this.alertMessage = validReservation(
      size,
      this.form.get('date')?.value as Date,
      this.form.get('time')?.value as Date,
      this.restaurant.operationTime.openTime,
      this.restaurant.operationTime.closeTime,
      this.restaurant.maxReservationSize,
      this.restaurant.operationTime.openDay,
    );

    if (this.alertMessage === '') {
      if (this.mode === 'create') {
        const payload = {
          rid: this.restaurant.id,
          dinerId: this.auth.user.value?.id as string,
          size,
          date,
          time,
        };
        this.reserving = true;
        await this.userSv.reserve(payload);
        this.reserving = false;
      } else if (this.mode === 'update' && this.reservation) {
        this.userSv
          .updateReservation({
            reservationId: this.reservation.id,
            date,
            time,
            size,
            request: 'update',
            rid: this.reservation.restaurant.id,
          })
          .then((res) => {
            this.afterSubmitted.emit(res);
          });
      }
    }
  }
}
