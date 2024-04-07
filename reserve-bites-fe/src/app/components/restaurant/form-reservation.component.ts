import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { validReservation } from 'src/app/utils/reservation';
import { AlertComponent } from '../common/alert.component';
import { FormInputComponent } from '../common/form-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatNativeDateModule,
  ],
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
      .overlay {
        @include overlayLock;
      }
    `,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmitReservation()">
      <h5>Make a reservation</h5>

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
        mat-raised-button
        color="primary"
        style="width:100%; margin-top: 10px"
        [disabled]="reserving"
      >
        Reserve
      </button>

      <div *ngIf="!canMakeReservation" class="overlay">Reservation can only be made by diners</div>
    </form>
  `,
})
export class FormReservationComponent implements OnInit {
  @Input() restaurant!: IRestaurant;
  @Input() rid!: string;

  form = this.fb.group({
    size: [1, Validators.required],
    date: [new Date(), Validators.required],
    time: [new Date(), Validators.required],
  });
  reserving = false;
  alertMessage = '';
  canMakeReservation = true;

  constructor(private fb: FormBuilder, private auth: AuthService, private userSv: UserService) {
    auth.user.subscribe((u) => {
      if (!u) {
        this.canMakeReservation = false;
      } else if (u && u.isOwner) {
        this.canMakeReservation = false;
      } else {
        this.canMakeReservation = true;
      }
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.alertMessage = '';
    });
  }

  async handleSubmitReservation() {
    const size = Number(this.form.get('size')?.value);

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
}
