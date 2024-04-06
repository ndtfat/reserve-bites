import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroXMarkSolid } from '@ng-icons/heroicons/solid';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'snackbar',
  standalone: true,
  imports: [NgClass, NgIconsModule],
  viewProviders: [provideIcons({ heroXMarkSolid })],
  styles: [
    `
      @import '../../scss/variables.scss';
      @import '../../scss/common.scss';
      .wrapper {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 999999;
        @include shadow;
        @include flex(row, center, space-between);
        height: 80px;
        padding: 16px;
        background: #fff;
        border-radius: 4px;
        transform-origin: 100% 100%;
        opacity: 0;
        transform: scale(0.6);
        transition: opacity 0.1s ease-out, transform 0.1s ease-out;
        pointer-events: none;
        .padding-color {
          width: 6px;
          height: 100%;
          border-radius: 4px;
          margin-right: 16px;
        }
        .content {
          @include flex(column, flex-start, space-between);
          .title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 6px;
            &:first-letter {
              text-transform: uppercase;
            }
          }
        }
        .close-button {
          width: 22px;
          height: 22px;
          align-self: flex-start;
          @include flex(row, center, center);
          margin-left: 60px;
          .close-icon {
            font-size: 22px;
          }
        }
      }
      .wrapper.open {
        opacity: 1;
        transform: scale(1);
        pointer-events: all;
      }
      .wrapper.warn {
        .padding-color {
          background: $snackbar-warn-color;
        }
        .content > .title {
          color: $snackbar-warn-color;
        }
      }
      .wrapper.error {
        .padding-color {
          background: $snackbar-error-color;
        }
        .content > .title {
          color: $snackbar-error-color;
        }
      }
      .wrapper.success {
        .padding-color {
          background: $snackbar-success-color;
        }
        .content > .title {
          color: $snackbar-success-color;
        }
      }
    `,
  ],
  template: `
    <div
      class="wrapper"
      [ngClass]="{
        open: open,
        success: type === 'success',
        error: type === 'error',
        warn: type === 'warn'
      }"
    >
      <div class="padding-color"></div>
      <div class="content">
        <p class="title">{{ type }}</p>
        <p class="message">{{ message }}</p>
      </div>
      <button class="close-button" mat-icon-button (click)="closeSnackbar()">
        <ng-icon class="close-icon" name="heroXMarkSolid" />
      </button>
    </div>
  `,
})
export class SnackbarComponent {
  type: 'success' | 'error' | 'warn' = 'success';
  message: string = '';
  open: boolean = false;

  constructor(private _snackbar: SnackbarService) {
    this._snackbar.openSnackbar.subscribe((isOpen) => {
      this.type = this._snackbar.type;
      this.message = this._snackbar.message;
      this.open = isOpen;
    });
  }

  closeSnackbar() {
    this._snackbar.openSnackbar.next(false);
  }
}
