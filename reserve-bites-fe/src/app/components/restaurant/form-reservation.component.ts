import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IRestaurant } from 'src/app/types/restaurant.type';

@Component({
  selector: 'form-reservation',
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmitReservation()">
      <h5>Make a reservation</h5>

      <alert *ngIf="alertMessage">{{ alertMessage }}</alert>
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
        <timepicker
          formControlName="time"
          [hourStep]="1"
          [minuteStep]="1"
          [showMeridian]="false"
        />
      </span>

      <button
        mat-raised-button
        color="primary"
        style="width:100%; margin-top: 10px"
        [disabled]="reserving"
      >
        Reserve
      </button>
    </form>
  `,
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      form {
        width: 100%;
        padding: 10px 16px 20px;
        position: sticky;
        top: calc($header-height + 60px);
        @include shadow;
        background: #fff;
        border-radius: 4px;
      }
      h5 {
        padding: 6px 0 16px;
        text-align: center;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class FormReservationComponent implements OnInit {
  @Input() restaurant!: IRestaurant;
  @Input() rid!: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userSv: UserService,
  ) {}

  form = this.fb.group({
    size: [1, Validators.required],
    date: [new Date(), Validators.required],
    time: [new Date(), Validators.required],
  });
  reserving = false;
  alertMessage = '';

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.alertMessage = '';
    });
  }

  async handleSubmitReservation() {
    this.alertMessage = '';
    const size = Number(this.form.get('size')?.value);
    const today = new Date().getTime();
    const reserveDate = new Date(
      this.form.get('date')?.value as Date,
    ).getTime();

    const reserveHour = new Date(
      this.form.get('time')?.value as Date,
    ).getHours();
    const reserveMinute = new Date(
      this.form.get('time')?.value as Date,
    ).getMinutes();

    const openHour = new Date(
      this.restaurant.operationTime.openTime,
    ).getHours();
    const closeHour = new Date(
      this.restaurant.operationTime.closeTime,
    ).getHours();
    const openMinute = new Date(
      this.restaurant.operationTime.openTime,
    ).getMinutes();
    const closeMinute = new Date(
      this.restaurant.operationTime.closeTime,
    ).getMinutes();

    // console.table({ openHour, openMinute });

    const isHourInRange =
      reserveHour > openHour ||
      (reserveHour === openHour && reserveMinute >= openMinute);
    const isMinuteInRange =
      reserveHour < closeHour ||
      (reserveHour === closeHour && reserveMinute <= closeMinute);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const reserveDay =
      daysOfWeek[new Date(this.form.get('date')?.value as Date).getDay()];

    // console.log(
    //   reserveDay,
    //   this.restaurant.operationTime.openDay.includes(reserveDay),
    // );

    if (size > this.restaurant.maxReservationSize) {
      this.alertMessage = `Max party size is ${this.restaurant.maxReservationSize}`;
      return;
    }
    if (today - reserveDate > 0) {
      this.alertMessage = `Selected date must the day after today`;
      return;
    }
    if (!this.restaurant.operationTime.openDay.includes(reserveDay)) {
      this.alertMessage = `Restaurant not open on selected day`;
      return;
    }
    if (!(isHourInRange && isMinuteInRange)) {
      this.alertMessage = `Restaurant not open on selected time`;
      return;
    }

    // pas all conditions
    const payload = {
      rid: this.rid,
      dinerId: this.auth.user.value?.id as string,
      size,
      date: this.form.value.date as Date,
      time: this.form.value.time as Date,
    };
    this.reserving = true;
    await this.userSv.reserve(payload);
    this.reserving = false;
  }
}
