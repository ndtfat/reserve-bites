import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'sign-up',
  styles: [
    `
      @import '../../scss/responsive.scss';
      form {
        width: 100%;
        background: #fff;
        border-radius: 4px;
      }

      button {
        width: 100%;
        margin-top: 10px;
      }

      .title {
        font-size: 48px;
        margin-bottom: 20px;
      }

      .alert {
        display: block;
        margin-bottom: 20px;
        padding: 0;
      }

      .field-name {
        display: flex;
        width: 100%;
        margin-top: 10px;

        & > * {
          flex: 1;
        }
      }

      .chips-list > div {
        justify-content: center;
      }

      @include tablet {
        form {
          padding: 25px;
        }

        .field-name {
          flex-direction: row;
          gap: 10px;
        }
      }

      @include mobile {
        form {
          padding: 60px 20px;
        }

        .field-name {
          flex-direction: column;
          gap: 0;
        }
      }
    `,
  ],
  template: `
    <form [formGroup]="form">
      <logo class="logo" [text]="true" width="140px" />
      <div style="margin-bottom: 10px;"></div>

      <h1 class="title">Sign Up</h1>
      <p>
        You are a restaurant owner?
        <a [routerLink]="'/restaurant-register'">Create your restaurant.</a>
      </p>
      <alert *ngIf="alertMessage" class="alert">
        {{ alertMessage }}
      </alert>

      <mat-stepper linear [selectedIndex]="step">
        <mat-step>
          <ng-template matStepLabel>Information</ng-template>
          <div class="field-name">
            <div>
              <form-input
                [formGroup]="form"
                name="firstName"
                label="First name"
                [errors]="form.controls['firstName'].errors"
              />
            </div>
            <div>
              <form-input
                [formGroup]="form"
                name="lastName"
                label="Last name"
                [errors]="form.controls['lastName'].errors"
              />
            </div>
          </div>
          <form-input
            [formGroup]="form"
            name="address"
            label="Your country"
            [errors]="form.controls['address'].errors"
          />
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
          <button type="button" mat-button (click)="handleNext()">Next</button>
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Favorite cuisines</ng-template>
          <div
            style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px;"
          >
            <h5>Your favorite cuisines</h5>
            <mat-form-field style="width: 100%;">
              <mat-label>Favorite Cuisines</mat-label>
              <mat-chip-grid #chipGrid>
                <mat-chip-row
                  *ngFor="let cuisine of cuisines"
                  (click)="removeCuisine(cuisine)"
                >
                  {{ cuisine }}
                </mat-chip-row>
              </mat-chip-grid>
              <input
                #favoriteInput
                placeholder="New cuisine..."
                [matChipInputFor]="chipGrid"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                (matChipInputTokenEnd)="addCuisine($event)"
              />
            </mat-form-field>

            <mat-chip-set class="chips-list">
              <mat-chip (click)="cuisines.push('VietNam')">Viet Nam</mat-chip>
              <mat-chip (click)="cuisines.push('Japan')">Japan</mat-chip>
              <mat-chip (click)="cuisines.push('Korea')">Korea</mat-chip>
              <mat-chip (click)="cuisines.push('Beef')">Beef</mat-chip>
              <mat-chip (click)="favoriteInput.focus()">Type yours</mat-chip>
            </mat-chip-set>
          </div>

          <div style="display: flex; gap: 10px">
            <button type="button" mat-button (click)="handleBack()">
              Back
            </button>
            <button
              mat-raised-button
              color="primary"
              [disabled]="loading"
              (click)="handleSubmit()"
            >
              <mat-spinner *ngIf="loading" [diameter]="30" />
              <span *ngIf="!loading">Create account</span>
            </button>
          </div>
        </mat-step>
      </mat-stepper>
      <p style="text-align: center">
        Have an account? <a [routerLink]="'/auth/sign-in'">Sign in.</a>
      </p>
    </form>
  `,
})
export class SignUpComponent {
  constructor(private auth: AuthService, private router: Router) {}

  // @ViewChild('favoriteInput') favoriteInput: ElementRef;

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.max(255), Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.max(255), Validators.required],
    }),
    address: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.max(255), Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
        ),
      ],
    }),
  });

  step = 0;
  loading: boolean = false;
  cuisines: string[] = [];
  showPassword: boolean = false;
  alertMessage: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];

  handleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  handleNext() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.step = 1;
    }
  }

  handleBack() {
    this.step = 0;
  }

  addCuisine(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.cuisines.push(value);
    }
    event.chipInput!.clear();
  }

  removeCuisine(cuisine: string) {
    this.cuisines = this.cuisines.filter((c) => c !== cuisine);
  }

  async handleSubmit() {
    this.loading = true;
    try {
      const { firstName, lastName, email, password, address } = this.form.value;

      if (this.form.valid) {
        await this.auth.signUp(
          firstName,
          lastName,
          email,
          password,
          address,
          this.cuisines,
        );
      }
    } catch (error: any) {
      this.alertMessage = error.error.message;
    }
    this.loading = false;
  }
}
