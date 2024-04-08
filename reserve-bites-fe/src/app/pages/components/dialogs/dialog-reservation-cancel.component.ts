import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IReservation } from 'src/app/types/restaurant.type';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'dialog-reservation-cancel',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
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
})
export class DialogReservationCancelComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IReservation,
    public dialogRef: MatDialogRef<DialogReservationCancelComponent>,
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
