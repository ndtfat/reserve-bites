import { format } from 'date-fns';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IRestaurant, IReview } from 'src/app/types/restaurant.type';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BehaviorSubject } from 'rxjs';
import { SortBy } from 'src/app/types/filter.type';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserType } from 'src/app/types/auth.type';
import { NotificationType } from 'src/app/types/notification';

@Component({
  selector: 'restaurant',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      img {
        @include img-fit(100vw, 300px);
      }
      .body {
        @include flex(row, flex-start, flex-start);
        gap: 10px;
        margin: 0 30px;
        transform: translateY(-50px);
      }
      .info {
        @include shadow;
        background: #fff;
        border-radius: 4px;
        flex: 1;
        padding: 10px 20px;
      }
      .reservation {
        width: 34%;
      }

      @include desktop {
        .body {
          width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="restaurant">
      <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" />
      <div class="body">
        <div class="info">
          <mat-tab-group (selectedIndexChange)="handleTabChange($event)">
            <mat-tab label="Overview">
              <restaurant-tab-overview [restaurant]="restaurant" />
            </mat-tab>
            <mat-tab label="Reviews">
              <restaurant-tab-reviews
                *ngIf="currentTabIndex === 1"
                [rid]="rid"
                [reviews]="reviews"
                [userReview]="userReview"
                [totalPages]="totalReviewPages"
                [pageOption]="reviewPagination"
                (sortChange)="handleReviewSortChange($event)"
                (postUserReview)="handlePostReview($event)"
                (editUserReview)="handleEditUserReview($event)"
                (deleteUserReview)="handleDeleteUserReview($event)"
              />
            </mat-tab>
          </mat-tab-group>
        </div>

        <form-reservation class="reservation" [restaurant]="restaurant" [rid]="rid" />
      </div>
    </div>
  `,
})
export class RestaurantComponent implements OnInit {
  rid!: string;
  restaurant!: IRestaurant;
  currentTabIndex = 0;

  // review tab
  reviews: IReview[] = [];
  totalReviewPages = 1;
  userReview: IReview | null = null;
  reviewLoading = false;
  reviewLoadingMore = false;
  reviewPagination: BehaviorSubject<{ page: number; sortBy: string }> = new BehaviorSubject({
    page: 1,
    sortBy: 'desc',
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socket: SocketService,
    private userSv: UserService,
    private restaurantSv: RestaurantService,
  ) {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = route.snapshot.paramMap.get('id');
      if (id) {
        this.rid = id;
        this.restaurantSv.getRestaurant(id).subscribe(
          (response) => {
            this.restaurant = response;
          },
          (error) => {
            this.router.navigateByUrl('/404');
          },
        );
      }
    }
  }

  ngOnInit() {
    this.reviewPagination.subscribe(async ({ page, sortBy }) => {
      const { itemsList, userItem, totalPages } = await this.restaurantSv.getReviews(
        this.rid,
        page,
        sortBy,
      );
      this.userReview = userItem;
      this.totalReviewPages = totalPages;
      this.reviews = [...this.reviews, ...itemsList];
      console.log(this.reviews);
    });
  }

  handleTabChange(index: number) {
    this.currentTabIndex = index;
  }

  handleReviewSortChange(sortBy: SortBy) {
    this.reviewLoading = true;
    this.reviewPagination.next({
      ...this.reviewPagination.value,
      sortBy,
    });
  }

  async handlePostReview(payload: any) {
    const response = await this.userSv.review(payload);
    if (response) {
      this.userReview = response;
      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: this.rid,
        },
        type: NotificationType.POST_REVIEW,
      });
    }
  }

  async handleEditUserReview(editData: any) {
    const response = await this.userSv.updateReview(this.userReview?.id as string, editData);
    if (response) {
      this.userReview = response;
      // this.editting = false;
      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: this.rid,
        },
        type: NotificationType.UPDATE_REVIEW,
      });
    }
  }

  async handleDeleteUserReview(reviewId: string) {
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
