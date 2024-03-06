import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IReview } from 'src/app/types/restaurant.type';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { IUser, UserType } from 'src/app/types/auth.type';
import { NotificationType } from 'src/app/types/notification';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'restaurant-tab-reviews',
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
          position: absolute;
          inset: 0;
          filter: blur(0.5);
          font-size: 20px;
          font-weight: bold;
          @include flex(row, center, center);
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 1;
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

          <!-- <div class="overlay">Reviews can only be made by diners who have eaten at this restaurant</div> -->
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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <ul *ngIf="!loading">
          <li *ngFor="let r of reviews">
            <restaurant-review [review]="r" />
            <mat-divider style="margin:20px 10px;" />
          </li>

          <mat-spinner *ngIf="loadingMore" />
        </ul>
        <mat-spinner *ngIf="loading" />
      </div>
      <h6 *ngIf="reviews.length === 0">There is no review for this restaurant</h6>
    </div>
  `,
})
export class RestaurantTabReviewsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userSv: UserService,
    private socket: SocketService,
    private restaurantSv: RestaurantService,
  ) {}

  @Input() rid!: string;
  loading = true;
  editting = false;
  submitting = false;
  loadingMore = false;
  reviews: IReview[] = [];
  totalPages = 0;
  userReview: (IReview & { id: string }) | null = null;
  pageOption = new BehaviorSubject({
    page: 1,
    sortBy: 'desc',
  });

  form = this.fb.group({
    food: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    service: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    ambiance: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    content: ['', Validators.required],
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
      this.pageOption.next({
        ...this.pageOption.value,
        page: currentReviewPage + 1,
      });
    }
  }

  ngOnInit() {
    this.pageOption.subscribe(async ({ page, sortBy }) => {
      const { itemsList, userItem, totalPages } = await this.restaurantSv.getReviews(
        this.rid,
        page,
        sortBy,
      );
      this.userReview = userItem;
      this.form.setValue({
        food: userItem?.food || null,
        service: userItem?.service || null,
        ambiance: userItem?.ambiance || null,
        content: userItem?.content || '',
      });
      this.totalPages = totalPages;
      if (this.loadingMore) {
        this.reviews = [...this.reviews, ...itemsList];
        this.loadingMore = false;
      } else {
        this.reviews = itemsList;
        this.loading = false;
      }
    });
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
        const response = await this.userSv.updateReview(this.userReview?.id as string, payload);
        if (response) {
          this.userReview = response;
          this.editting = false;
          this.socket.sendNotification(notificationPayload);
        }
      } else {
        const response = await this.userSv.review(payload);
        if (response) {
          this.userReview = response;
          this.socket.sendNotification(notificationPayload);
        }
      }

      this.submitting = false;
    }
  }

  handleSortChange(event: Event) {
    this.loading = true;
    this.pageOption.next({
      ...this.pageOption.value,
      sortBy: (event.target as HTMLSelectElement).value,
    });
  }

  async handleDeleteReview(reviewId: string) {
    await this.userSv.deleteReview(reviewId);
    this.userReview = null;
    this.socket.sendNotification({
      senderId: this.auth.user.value?.id as string,
      receiver: {
        type: UserType.OWNER,
        rid: this.rid,
      },
      type: NotificationType.DELETE_REVIEW,
    });
  }
}
