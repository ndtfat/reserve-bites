import { Component } from '@angular/core';

@Component({
  selector: 'restaurant-review',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper {
        @include flex(row, flex-start, center);
        gap: 20px;
      }
      .user-info {
        width: 100px;
        @include flex(column, center, center);
        p {
          font-weight: 700 !important;
          margin-top: 6px;
          font-weight: 500;
        }
      }
      .body {
        flex: 1;
        .date {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .point {
          display: flex;
          gap: 10px;
          font-size: 14px;
          margin-bottom: 10px;
          span {
            color: $primary;
            font-weight: 600;
            margin-right: 4px;
          }
        }
        .content.less { @include ellipsis(2); }
        .toggle-content {
          @include cursor;
          color: $primary;
          font-size: 14px;
          font-weight: 600;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="user-info">
        <ng-icon size="40" name="heroUserCircleSolid" />
        <p>Phat Nguyen</p>
      </div>
      <div class="body">
        <p class="date">November 23, 2023</p>
        <div class="point">
          <p><span>Food</span>5</p>
          <p><span>Service</span>5</p>
          <p><span>Ambiance</span>5</p>
          <p><span>Overall</span>5</p>
        </div>
        <p class="content" [ngClass]="{ less: !showFull }">
          The food is great. The same with service The food is great. The same
          with service The food is great. The same with service The food is
          great. The same with service The food is great. The same with service
          The food is great. The same with service
        </p>
        <span class="toggle-content" (click)="showFull = !showFull">
          {{ showFull ? 'Show less' : 'Read more' }}
        </span>
      </div>
    </div>
  `,
})
export class RestaurantReviewComponent {
  showFull = false;
}
