import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormReservationComponent } from '../forms/form-reservation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IReservation } from 'src/app/types/restaurant.type';

@Component({
  selector: 'dialog-reservation-edit',
  standalone: true,
  imports: [FormReservationComponent],
  template: ` <div class="wrapper">
    <h2>Edit reservation</h2>

    <form-reservation
      [restaurant]="data.restaurant"
      [reservation]="data"
      (afterSubmitted)="handleClose($event)"
    />
  </div>`,
  styles: [
    `
      @import '../../../scss/common.scss';
      .wrapper {
        min-height: 10px;
        min-width: 600px;
        padding: 20px;
      }
      h2 {
        font-weight: bold;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class DialogReservationEditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IReservation,
    public dialogRef: MatDialogRef<DialogReservationEditComponent>,
  ) {}

  handleClose(data: IReservation | null) {
    this.dialogRef.close(data);
  }
}
