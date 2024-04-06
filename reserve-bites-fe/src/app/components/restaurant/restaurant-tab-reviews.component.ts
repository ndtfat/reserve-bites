import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IUser, UserType } from 'src/app/types/auth.type';
import { SortBy } from 'src/app/types/filter.type';
import { NotificationType } from 'src/app/types/notification';
import { IReview } from 'src/app/types/restaurant.type';
import { FormInputComponent } from '../common/form-input.component';
import { RestaurantReviewComponent } from './restaurant-review.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'restaurant-tab-reviews',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatDividerModule,
    FormInputComponent,
    ReactiveFormsModule,
    RestaurantReviewComponent,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper {
        padding: 20px 0 10px;
      }
      h2 {
        font-weight: 600;
        margin-bottom: 20px;
      }
      h6 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      .review-box {
        position: relative;
        padding: 10px;
        margin-bottom: 30px;
        border: 10px solid $primary--blur;
        .point {
          display: flex;
          gap: 20px;
          & > * {
            flex: 1;
          }
        }
        .overlay {
          @include overlayLock;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>Reviews</h2>
      <h6>
        {{
          userReview
            ? 'Your review for this restaurant'
            : 'What are your feeling about this restaurant?'
        }}
      </h6>
      <div class="review-box">
        <form (ngSubmit)="handleSubmit()" *ngIf="!userReview || editting">
          <div [formGroup]="form" class="point">
            <form-input
              label="Food"
              type="number"
              name="food"
              [formGroup]="form"
              [errors]="form.controls['food'].errors"
            />
            <form-input
              label="Service"
              type="number"
              name="service"
              [formGroup]="form"
              [errors]="form.controls['service'].errors"
            />
            <form-input
              label="Ambiance"
              type="number"
              name="ambiance"
              [formGroup]="form"
              [errors]="form.controls['ambiance'].errors"
            />
          </div>
          <form-input
            textarea
            label="Your review"
            name="content"
            [formGroup]="form"
            [errors]="form.controls['content'].errors"
          />
          <div style="display: flex; justify-content: flex-end;">
            <button
              mat-raised-button
              type="button"
              style="margin-right: 10px;"
              (click)="editting = false"
            >
              Cancel
            </button>
            <button mat-raised-button color="primary" [disabled]="submitting">
              {{ editting ? 'Update' : 'Post' }}
            </button>
          </div>

          <div *ngIf="!canMakeReview" class="overlay">
            Reviews can only be made by diners who have eaten at this restaurant
          </div>
        </form>

        <restaurant-review
          *ngIf="userReview && !editting"
          setting
          [review]="userReview"
          (delete)="handleDeleteReview($event)"
          (edit)="editting = true"
        />
      </div>

      <div *ngIf="reviews.length > 0">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h6>What other diners said about this restaurant:</h6>
          <select style="margin: 0" (change)="handleSortChange($event)">
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
        <ul>
          <li *ngFor="let r of reviews">
            <restaurant-review [review]="r" />
            <mat-divider style="margin:20px 10px;" />
          </li>

          <mat-spinner *ngIf="loadingMore" />
        </ul>
        <div *ngIf="totalPages > 1">Scroll down to load more</div>
        <!-- <mat-spinner *ngIf="loading" /> -->
      </div>
      <h6 *ngIf="reviews.length === 0">There is no review for this restaurant</h6>
    </div>
  `,
})
export class RestaurantTabReviewsComponent {
  constructor(private fb: FormBuilder, private auth: AuthService) {
    auth.user.subscribe((u) => {
      if (u && u.isOwner) {
        this.canMakeReview = false;
      } else {
        this.canMakeReview = true;
      }
    });
  }

  @Input() rid!: string;
  @Input() reviews: IReview[] = [];
  @Input() userReview: IReview | null = null;
  @Input() totalPages = 1;
  @Input() pageOption!: BehaviorSubject<{ page: number; sortBy: string }>;
  @Output() loadMore = new EventEmitter();
  @Output() sortChange = new EventEmitter<SortBy>();
  @Output() postUserReview = new EventEmitter();
  @Output() editUserReview = new EventEmitter();
  @Output() deleteUserReview = new EventEmitter<string>();

  // loading = true;
  editting = false;
  submitting = false;
  loadingMore = false;
  canMakeReview = true;

  form = this.fb.group({
    food: [this.userReview?.food || 0, [Validators.required, Validators.min(0), Validators.max(5)]],
    service: [
      this.userReview?.service || 0,
      [Validators.required, Validators.min(0), Validators.max(5)],
    ],
    ambiance: [
      this.userReview?.ambiance || 0,
      [Validators.required, Validators.min(0), Validators.max(5)],
    ],
    content: [this.userReview?.content || '', Validators.required],
  });

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    const headerHeight = 90;
    const windowHeight = window.innerHeight; // Height of the viewport
    const documentHeight = document.body.offsetHeight; // Total height of the document
    const scrollTop = (window.scrollY || document.documentElement.scrollTop) - headerHeight; // Current scroll position

    const isBottom = documentHeight - windowHeight - scrollTop <= 0;
    const currentReviewPage = this.pageOption.value.page;

    if (isBottom && currentReviewPage < this.totalPages) {
      this.loadingMore = true;
      this.loadMore.emit();
    }
  }

  async handleSubmit() {
    this.form.markAllAsTouched();

    const user = this.auth.user.value as IUser;
    const notificationPayload = {
      senderId: user.id,
      receiver: {
        type: UserType.OWNER,
        rid: this.rid,
      },
      type: this.editting ? NotificationType.UPDATE_REVIEW : NotificationType.POST_REVIEW,
    };

    if (this.form.valid) {
      this.submitting = true;
      const values = this.form.value;
      const payload = {
        rid: this.rid,
        dinerId: this.auth.user.value?.id as string,
        food: Number(values.food),
        service: Number(values.service),
        ambiance: Number(values.ambiance),
        content: values.content as string,
      };
      if (this.editting) {
        this.editUserReview.emit(payload);
        this.editting = false;
      } else {
        this.postUserReview.emit(payload);
      }

      this.submitting = false;
    }
  }

  handleSortChange(event: Event) {
    this.sortChange.emit((event.target as HTMLSelectElement).value as SortBy);
  }

  async handleDeleteReview(reviewId: string) {
    this.deleteUserReview.emit(reviewId);
  }
}
