import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { FormInputComponent } from 'src/app/components/common/form-input.component';
import { LogoComponent } from 'src/app/components/common/logo.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    LogoComponent,
    AlertComponent,
    MatButtonModule,
    FormInputComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      @import '../../scss/responsive.scss';

      form {
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
      @include mobile {
        form {
          // width: 100%;
          padding: 40px 20px;
        }
      }
      @include tablet {
        form {
          padding: 40px 30px;
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

      <a style="margin: 10px 0 20px; float: right" [routerLink]="'/auth/reset-password'"
        >Forgot password?
      </a>

      <button mat-raised-button color="black" [disabled]="loading">
        <mat-spinner *ngIf="loading" [diameter]="30" />
        <span *ngIf="!loading">Sign in</span>
      </button>
    </form>
  `,
})
export class SignInComponent {
  constructor(private auth: AuthService) {}

  form: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.max(255), Validators.email, Validators.required],
    }),
    password: new FormControl('', {
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
