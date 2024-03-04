import {
  Input,
  Output,
  Component,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
import { IReview } from 'src/app/types/restaurant.type';

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
        .content.less {
          @include ellipsis(2);
        }
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
        <p>
          {{ review.diner.firstName + ' ' + review.diner.lastName }}
        </p>
      </div>
      <div class="body">
        <p class="date">
          {{ review.createdAt | date : 'MMM dd, yyyy' }}
        </p>
        <div class="point">
          <p>
            <span>Food</span>
            {{ review.food }}
          </p>
          <p>
            <span>Service</span>
            {{ review.service }}
          </p>
          <p>
            <span>Ambiance</span>
            {{ review.ambiance }}
          </p>
          <!-- <p>
            <span>Overall</span>
            {{review.food}}
          </p> -->
        </div>
        <p class="content" [ngClass]="{ less: !showFull }">
          <!-- The food is great. The same with service The food is great. The same
          with service The food is great. The same with service The food is
          great. The same with service The food is great. The same with service
          The food is great. The same with service -->
          {{ review.content }}
        </p>
        <span class="toggle-content" (click)="showFull = !showFull">
          {{ showFull ? 'Show less' : 'Read more' }}
        </span>
      </div>
      <button
        *ngIf="review && deleteIcon"
        mat-icon-button
        (click)="handleDelete(review.id)"
      >
        <ng-icon size="20" name="heroTrash" />
      </button>
    </div>
  `,
})
export class RestaurantReviewComponent {
  @Input() review!: IReview;
  @Input({ transform: booleanAttribute }) deleteIcon = false;
  @Output() delete = new EventEmitter<string>();

  handleDelete(id: string) {
    this.delete.emit(id);
  }

  showFull = false;
}
