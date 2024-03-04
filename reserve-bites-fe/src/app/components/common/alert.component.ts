import { Component, Input } from '@angular/core';
import { AlertType } from 'src/app/types/notification';

@Component({
  selector: 'alert',
  styles: [
    `
      @import '../../scss/common.scss';
      div {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 16px;
        border-radius: 4px;
      }
      div.warn {
        color: #ce9e41;
        background-color: #fff3cd;
      }
      div.error {
        color: #c82727;
        background-color: #fff5f5;
      }
      div.success {
        color: #229939;
        background-color: #ebfbee;
      }
      div.info {
        color: #0f6ac0;
        background-color: #e7f5ff;
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
      <ng-icon
        *ngIf="type === 'info'"
        name="ionInformationCircleOutline"
        size="26"
      />
      <ng-icon
        *ngIf="type === 'success'"
        name="ionCheckmarkCircleOutline"
        size="26"
      />
      <p>
        <ng-content />
      </p>
    </div>
  `,
})
export class AlertComponent {
  @Input() type: AlertType | string = AlertType.SUCCESS;
}
