import { DatePipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { IUser } from 'src/app/types/auth.type';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormInputComponent } from '../../../components/common/form-input.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from '../../../components/common/alert.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'account-tab-profile',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgIconsModule,
    MatMenuModule,
    AlertComponent,
    MatButtonModule,
    MatDividerModule,
    FormInputComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  viewProviders: [provideIcons({ heroUserCircleSolid })],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      .menu-button {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .wrapper {
        margin: 20px 0;
        background: #fff;
      }
      .avatar-icon {
        margin-right: 20px;
      }
      .oserview {
        margin-bottom: 20px;
        p {
          margin-top: 4px;
          color: $sub-text-color;
        }
        span {
          display: inline-block;
          min-width: 114px;
          color: $text-color;
        }
        .greeting {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
      }
      form {
        margin-top: 20px;
        h3 {
          margin-bottom: 14px;
        }
        .alert {
          display: block;
          margin-bottom: 20px;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="user" class="wrapper container">
      <div class="oserview">
        <div class="greeting">
          <div style="display: flex; align-items: center;">
            <ng-icon name="heroUserCircleSolid" class="avatar-icon" size="100" />
            <span>
              <h1>Hi, {{ user.firstName + ' ' + user.lastName }}</h1>
              <p [style.color]="'green'">
                {{ user.isOwner ? 'Restaurant owner' : 'Diner' }}
              </p>
              <p>Member since {{ user.createdAt | date : 'MMM dd, yyyy' }}</p>
            </span>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <ng-icon name="ionSettingsOutline" />
          </button>
          <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item (click)="handleToogleForm('editProfile')">
              <div class="menu-button">
                <ng-icon name="matModeEditOutline" size="1.4rem" />
                <span>Edit Profile</span>
              </div>
            </button>
            <button mat-menu-item (click)="handleToogleForm('changePassword')">
              <div class="menu-button">
                <ng-icon name="ionLockClosedOutline" size="1.4rem" />
                <span>Change Password</span>
              </div>
            </button>
          </mat-menu>
        </div>
        <div>
          <p><span>First name</span> {{ user.firstName }}</p>
          <p><span>Last name</span> {{ user.lastName }}</p>
          <p><span>Email</span> {{ user.email }}</p>
        </div>
      </div>
      <mat-divider />

      <!-- Edit profile form -->
      <form
        *ngIf="openEditProfile"
        [formGroup]="editProfileForm"
        (ngSubmit)="handleSubmitEditProfile()"
      >
        <h3>Edit Profile</h3>

        <form-input
          [formGroup]="editProfileForm"
          name="firstName"
          label="First name"
          [errors]="editProfileForm.controls['firstName'].errors"
        />
        <form-input
          [formGroup]="editProfileForm"
          name="lastName"
          label="Last name"
          [errors]="editProfileForm.controls['lastName'].errors"
        />
        <form-input
          [formGroup]="editProfileForm"
          name="email"
          label="Email address"
          [errors]="editProfileForm.controls['email'].errors"
        />

        <div style="display: flex; justify-content: flex-end;">
          <button mat-raised-button color="black" type="submit" [disabled]="loading">
            <mat-spinner *ngIf="loading" [diameter]="30" />
            <span *ngIf="!loading">Save change</span>
          </button>
        </div>
      </form>

      <!-- Change password form -->
      <form
        *ngIf="openChangePassword"
        [formGroup]="changePasswordForm"
        (ngSubmit)="handleSubmitChangePassword()"
      >
        <h3>Change password</h3>

        <alert *ngIf="changePasswordError" class="alert">
          {{ changePasswordError }}
        </alert>

        <form-input
          #oldPassword
          [formGroup]="changePasswordForm"
          name="oldPassword"
          label="Old password"
          [errors]="changePasswordForm.controls['oldPassword'].errors"
          type="password"
          [icon]="oldPassword.type === 'text' ? 'visibility_off' : 'visibility'"
          (onClickIcon)="oldPassword.type = oldPassword.type === 'text' ? 'password' : 'text'"
        />
        <form-input
          #newPassword
          [formGroup]="changePasswordForm"
          name="newPassword"
          label="New password"
          [errors]="changePasswordForm.controls['newPassword'].errors"
          type="password"
          [icon]="newPassword.type === 'text' ? 'visibility_off' : 'visibility'"
          (onClickIcon)="newPassword.type = newPassword.type === 'text' ? 'password' : 'text'"
        />
        <form-input
          #confirmPassword
          [formGroup]="changePasswordForm"
          name="confirmPassword"
          label="Confirm password"
          [errors]="changePasswordForm.controls['confirmPassword'].errors"
          type="password"
          [icon]="confirmPassword.type === 'text' ? 'visibility_off' : 'visibility'"
          (onClickIcon)="
            confirmPassword.type = confirmPassword.type === 'text' ? 'password' : 'text'
          "
        />

        <div style="display: flex; justify-content: flex-end;">
          <button mat-raised-button color="black" type="submit" [disabled]="loading">
            <mat-spinner *ngIf="loading" [diameter]="30" />
            <span *ngIf="!loading">Save change</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AccountTabProfileComponent implements OnInit {
  @Input() user!: IUser;

  loading: boolean = false;
  openEditProfile: boolean = false;
  openChangePassword: boolean = false;
  changePasswordError: string = '';

  editProfileForm!: FormGroup;
  changePasswordForm: FormGroup;

  constructor(
    private _snackbar: SnackbarService,
    private userSv: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: new FormControl('', { validators: [Validators.required] }),
        newPassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, this.checkPasswords],
        }),
      },
      { validator: this.checkPasswords },
    );
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newPassword');
    let confirmPass = group.get('confirmPassword');

    if (confirmPass?.value && pass?.value !== confirmPass?.value) {
      confirmPass.setErrors({ matchPassword: true });
    }

    return pass?.value === confirmPass?.value ? null : { notSame: true };
  };

  ngOnInit(): void {
    if (this.user) {
      this.editProfileForm = new FormGroup({
        firstName: new FormControl(this.user.firstName, {
          validators: [Validators.required],
        }),
        lastName: new FormControl(this.user.lastName, {
          validators: [Validators.required],
        }),
        email: new FormControl(this.user.email, {
          validators: [Validators.required, Validators.email],
        }),
      });
    }
  }

  handleToogleForm(form: 'editProfile' | 'changePassword') {
    this.openEditProfile = form === 'editProfile';
    this.openChangePassword = form === 'changePassword';
  }

  async handleSubmitEditProfile() {
    this.loading = true;
    try {
      this.editProfileForm.markAllAsTouched();
      if (this.editProfileForm.valid) {
        const newInfo = await this.userSv.editProfile(this.editProfileForm.value);

        this.editProfileForm.setValue({
          firstName: newInfo.firstName,
          lastName: newInfo.lastName,
          email: newInfo.email,
        });
        this.openEditProfile = false;
        this._snackbar.open('success', 'You have edited profile success');
      }
    } catch ({ error }: any) {
      console.log(error);
    }
    this.loading = false;
  }

  async handleSubmitChangePassword() {
    this.loading = true;
    try {
      this.changePasswordForm.markAllAsTouched();

      if (this.changePasswordForm.valid) {
        const { oldPassword, newPassword } = this.changePasswordForm.value;
        await this.userSv.changePassword(oldPassword as string, newPassword as string);

        this.changePasswordForm.setValue({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        this.openChangePassword = false;
        this._snackbar.open('success', 'You have changed password success');
      }
    } catch ({ error }: any) {
      const errorMessage = error.message;
      this.changePasswordError = errorMessage;
    }
    this.loading = false;
  }
}
