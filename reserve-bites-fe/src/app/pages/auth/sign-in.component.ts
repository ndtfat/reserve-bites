import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'sign-in',
  styles: [
    `
      @import '../../scss/responsive.scss';
      form {
        padding: 60px 46px;
        background: #fff;
        width: 100%;
        border-radius: 4px;
      }

      button {
        width: 100%;
      }

      .title {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .alert {
        display: block;
        margin-bottom: 20px;
        padding: 0;
      }

      // @include desktop {
      //   form {
      //     width: 500px;
      //   }
      // }

      // @include tablet {
      //   form {
      //     width: 550px;
      //   }
      // }

      @include mobile {
        form {
          // width: 100%;
          padding: 60px 20px;
        }
      }
    `,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <logo class="logo" [text]="true" width="140px" />
      <div style="margin-bottom: 10px;"></div>

      <h1 class="title">Sign In</h1>
      <p style="margin-bottom: 20px;">
        New user? <a [routerLink]="'/auth/sign-up'">Create one.</a>
      </p>
      <alert *ngIf="alertMessage" class="alert" type="error">
        {{ alertMessage }}
      </alert>

      <!-- fields -->
      <form-input
        [formGroup]="form"
        name="email"
        label="Email address"
        [errors]="form.controls['email'].errors"
      />
      <form-input
        [formGroup]="form"
        name="password"
        label="Password"
        [type]="showPassword ? 'text' : 'password'"
        [icon]="showPassword ? 'visibility_off' : 'visibility'"
        (onClickIcon)="handleShowPassword()"
        [errors]="form.controls['password'].errors"
      />

      <a
        style="margin: 10px 0 20px; float: right"
        [routerLink]="'/auth/reset-password'"
        >Forgot password?
      </a>

      <button mat-raised-button color="primary" [disabled]="loading">
        <mat-spinner *ngIf="loading" [diameter]="30" />
        <span *ngIf="!loading">Sign in</span>
      </button>
    </form>
  `,
})
export class SignInComponent {
  constructor(private auth: AuthService) {}

  form: FormGroup = new FormGroup({
    email: new FormControl('phatnguyen@gmail.com', {
      validators: [Validators.max(255), Validators.email, Validators.required],
    }),
    password: new FormControl('123456789x@X', {
      validators: [Validators.required],
    }),
  });

  loading: boolean = false;
  showPassword: boolean = false;
  alertMessage: string = '';

  handleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    const { email, password } = this.form.value;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.loading = true;
      const { error } = await this.auth.signIn(email, password);
      this.alertMessage = error ? error : '';
      this.loading = false;
    }
  }
}
