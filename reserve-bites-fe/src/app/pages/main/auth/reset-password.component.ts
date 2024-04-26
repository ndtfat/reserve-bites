import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/components/common/alert.component';
import { FormInputComponent } from 'src/app/components/common/form-input.component';
import { LogoComponent } from 'src/app/components/common/logo.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [
    NgIf,
    LogoComponent,
    AlertComponent,
    MatButtonModule,
    FormInputComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      @import '../../../scss/responsive.scss';

      form {
        width: 100%;
        background: #fff;
        border-radius: 4px;
      }
      .title {
        font-size: 48px;
        margin-bottom: 16px;
      }

      @include mobile {
        form {
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
    <form [formGroup]="token ? resetPasswordForm : sendMailForm" (ngSubmit)="onSubmit()">
      <logo class="logo" [text]="true" width="140px" />
      <div style="margin-bottom: 10px;"></div>

      <h1 class="title">
        {{ token ? 'Reset pawword' : 'Forgot password?' }}
      </h1>
      <p *ngIf="!token" style="margin-bottom: 30px;">
        {{
          sentMail
            ? 'A reset password email was sent to email ' +
              sendMailForm.controls['email'].value +
              '. Please check!'
            : 'Enter the email address you used when you joined and we’ll send you instructions to reset your password.'
        }}
      </p>
      <p *ngIf="token && !resetSuccess" style="margin-bottom: 30px;">
        Enter your new password below!
      </p>

      <p *ngIf="token && resetSuccess" style="margin-bottom: 30px;">
        Your password has been reset. Click sign in button to go to sign in page!
      </p>

      <div *ngIf="errorMessage" style="margin-bottom: 10px;">
        <alert type="error">
          {{ errorMessage }}
        </alert>
      </div>

      <!-- fields -->
      <form-input
        *ngIf="!token && !sentMail"
        [formGroup]="sendMailForm"
        name="email"
        label="Email address"
        [errors]="sendMailForm.controls['email'].errors"
      />

      <form-input
        *ngIf="token && !resetSuccess"
        #newPassword
        [formGroup]="resetPasswordForm"
        name="password"
        label="New password"
        [errors]="resetPasswordForm.controls['password'].errors"
        type="password"
        [icon]="newPassword.type === 'text' ? 'visibility_off' : 'visibility'"
        (onClickIcon)="newPassword.type = newPassword.type === 'text' ? 'password' : 'text'"
      />
      <form-input
        *ngIf="token && !resetSuccess"
        #confirmPassword
        [formGroup]="resetPasswordForm"
        name="confirmPassword"
        label="Confirm password"
        [errors]="resetPasswordForm.controls['confirmPassword'].errors"
        type="password"
        [icon]="confirmPassword.type === 'text' ? 'visibility_off' : 'visibility'"
        (onClickIcon)="confirmPassword.type = confirmPassword.type === 'text' ? 'password' : 'text'"
      />

      <button
        mat-raised-button
        *ngIf="!sentMail"
        type="submit"
        color="black"
        style="margin-top: 6px;"
        [disabled]="fetching"
      >
        <mat-spinner *ngIf="fetching" [diameter]="30" />
        <span *ngIf="!fetching">
          {{ resetSuccess ? 'Sign in' : 'Continue' }}
        </span>
      </button>
    </form>
  `,
})
export class ResetPasswordComponent implements OnInit {
  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {}

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password');
    let confirmPass = group.get('confirmPassword');

    if (confirmPass?.value && pass?.value !== confirmPass?.value) {
      confirmPass.setErrors({ matchPassword: true });
    }

    return pass?.value === confirmPass?.value ? null : { notSame: true };
  };

  uid = '';
  token = '';
  sentMail = false;
  fetching = false;
  errorMessage = '';
  resetSuccess = false;
  sendMailForm: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.max(255), Validators.email, Validators.required],
    }),
  });
  resetPasswordForm = new FormGroup({
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, this.checkPasswords],
    }),
  });

  ngOnInit() {
    this.route.queryParams.subscribe((query) => {
      const { token, id } = query;
      this.uid = id;
      this.token = token;
    });
  }

  async onSubmit() {
    if (this.resetSuccess) {
      this.router.navigateByUrl('/auth/sign-in');
    } else {
      this.sendMailForm.markAllAsTouched();
      this.resetPasswordForm.markAllAsTouched();
      if (this.uid && this.token && this.resetPasswordForm.valid) {
        console.log('reset-password', {
          uid: this.uid,
          token: this.token,
          password: this.resetPasswordForm.value.password,
        });
        this.fetching = true;
        const { response, error } = await this.auth.resetPassword(
          this.uid,
          this.token,
          this.resetPasswordForm.value.password as string,
        );
        this.resetSuccess = !!response;
        this.errorMessage = error;
        this.fetching = false;
      } else if (!this.token && this.sendMailForm.valid) {
        console.log('Send mail: ', this.sendMailForm.value);
        this.fetching = true;
        const { response, error } = await this.auth.sendResetPasswordMail(
          this.sendMailForm.value.email,
        );
        this.sentMail = !!response;
        this.errorMessage = error;
        this.fetching = false;
      }
    }
  }
}
