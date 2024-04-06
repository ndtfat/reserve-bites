import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { AlertType } from 'src/app/types/notification';
import {
  ionAlertCircleOutline,
  ionCheckmarkCircleOutline,
  ionInformationCircleOutline,
  ionWarningOutline,
} from '@ng-icons/ionicons';

@Component({
  selector: 'alert',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  viewProviders: [
    provideIcons({
      ionWarningOutline,
      ionAlertCircleOutline,
      ionCheckmarkCircleOutline,
      ionInformationCircleOutline,
    }),
  ],
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';

      div {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 16px;
        border-radius: 4px;
      }
      div.warn {
        color: $text-warn-color;
        background-color: $bg-warn;
      }
      div.error {
        color: $text-error-color;
        background-color: $bg-error;
      }
      div.success {
        color: $text-success-color;
        background-color: $bg-success;
      }
      div.info {
        color: $text-info-color;
        background-color: $bg-info;
      }
      p {
        @include ellipsis;
      }
    `,
  ],
  template: `
    <div [className]="type">
      <ng-icon *ngIf="type === 'error'" name="ionWarningOutline" size="26" />
      <ng-icon *ngIf="type === 'warn'" name="ionAlertCircleOutline" size="26" />
      <ng-icon *ngIf="type === 'info'" name="ionInformationCircleOutline" size="26" />
      <ng-icon *ngIf="type === 'success'" name="ionCheckmarkCircleOutline" size="26" />
      <p>
        <ng-content />
      </p>
    </div>
  `,
})
export class AlertComponent {
  @Input() type: AlertType | string = AlertType.SUCCESS;
}
