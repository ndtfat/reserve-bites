import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Input, Output, Component, EventEmitter, booleanAttribute } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { IReview } from 'src/app/types/restaurant.type';

@Component({
  selector: 'restaurant-review',
  standalone: true,
  imports: [NgIf, NgIconsModule, DatePipe, NgClass, MatButtonModule],
  viewProviders: [provideIcons({ heroUserCircleSolid })],
  styles: [
    `
      @import '../../../../scss/common.scss';
      @import '../../../../scss/variables.scss';
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
        <span
          *ngIf="review.content.length > 150"
          class="toggle-content"
          (click)="showFull = !showFull"
        >
          {{ showFull ? 'Show less' : 'Read more' }}
        </span>
      </div>

      <div *ngIf="review && setting" style="display: flex;">
        <button mat-icon-button (click)="handleEdit()">
          <ng-icon size="20" name="heroPencil" />
        </button>
        <button mat-icon-button (click)="handleDelete(review.id)">
          <ng-icon size="20" name="heroTrash" />
        </button>
      </div>
    </div>
  `,
})
export class RestaurantReviewComponent {
  @Input() review!: IReview;
  @Input({ transform: booleanAttribute }) setting = false;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<boolean>();

  handleDelete(id: string) {
    this.delete.emit(id);
  }

  handleEdit() {
    this.edit.emit(true);
  }

  showFull = false;
}
