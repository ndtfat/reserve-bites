import { Component } from '@angular/core';

@Component({
  selector: 'notification',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      .wrapper {
        margin: 0 30px;
        padding: 20px 0;
        height: calc(100vh - 40px);
      }
      .container {
        @include flex(column, flex-start, flex-start);
        gap: 20px;
        height: 100%;
      }
      .list {
        width: 100%;

        li {
          @include flex(row, center, flex-start);
          gap: 14px;
          border-radius: 4px;
          padding: 14px 8px;
          cursor: pointer;
          &:hover,
          &.readed {
            background: rgba(0, 0, 0, 0.03);
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .dot {
            width: 10px;
            height: 10px;
            background: #4daa57;
            border-radius: 50%;
          }
        }
      }

      @include desktop {
        .wrapper {
          max-width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <h3 style="margin-bottom: 30px;">Notifications</h3>

        <div style="display: flex;">
          <ng-icon
            name="ionInformationCircleOutline"
            size="36"
            color="#3E82F7"
          />
          <ng-icon name="ionCheckmarkCircleOutline" size="36" color="#38BF37" />
          <ng-icon name="ionWarningOutline" size="36" color="#f24642" />
        </div>

        <ul class="list">
          <li class="readed">
            <ng-icon
              name="ionCheckmarkCircleOutline"
              size="36"
              color="#38BF37"
            />
            <div style="flex: 1">
              <p class="title">Confirm reservation</p>
              <p class="message">
                Your reservation at Bun bo di 3 was confirmed
              </p>
            </div>
            <!-- <span class="dot"></span> -->
          </li>
          <li class="">
            <ng-icon name="ionWarningOutline" size="36" color="#f24642" />
            <div style="flex: 1">
              <p class="title">Cancel reservation</p>
              <p class="message">
                Your reservation at Bun bo di 3 was canceled
              </p>
            </div>
            <span class="dot"></span>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class NotificationComponent {}
