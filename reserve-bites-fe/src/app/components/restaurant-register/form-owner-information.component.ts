import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IFormOwnerInformationType } from 'src/app/types/restaurant.type';

@Component({
  selector: 'form-owner-information',
  styles: [
    `
      h4 {
        font-size: 20px;
        font-weight: bold;
        margin-top: 16px;
        margin-bottom: 20px;
      }
      .button-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    `,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <!-- fields -->
      <h4>Owner Information</h4>

      <form-input
        [formGroup]="form"
        name="firstName"
        label="First name"
        [errors]="form.controls['firstName'].errors"
      />
      <form-input
        [formGroup]="form"
        name="lastName"
        label="Last name"
        [errors]="form.controls['lastName'].errors"
      />
      <form-input
        [formGroup]="form"
        name="email"
        label="Email address"
        [errors]="form.controls['email'].errors"
      />
      <form-input
        #confirmPassword
        [formGroup]="form"
        name="password"
        label="Password"
        [errors]="form.controls['password'].errors"
        type="password"
        [icon]="
          confirmPassword.type === 'text' ? 'visibility_off' : 'visibility'
        "
        (onClickIcon)="
          confirmPassword.type =
            confirmPassword.type === 'text' ? 'password' : 'text'
        "
      />

      <div class="button-wrapper">
        <button type="submit" mat-raised-button color="primary">Next</button>
      </div>
    </form>
  `,
})
export class FormOwnerInformationComponent {
  @Output() onSubmit = new EventEmitter<IFormOwnerInformationType>();

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.max(255), Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.max(255), Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.max(255), Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
        ),
      ],
    }),
  });

  handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}
