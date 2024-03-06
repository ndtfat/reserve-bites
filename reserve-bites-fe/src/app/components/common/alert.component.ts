import { Component, Input } from '@angular/core';
import { AlertType } from 'src/app/types/notification';

@Component({
  selector: 'alert',
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
