import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SortBy } from 'src/app/types/filter.type';
import { UserType } from 'src/app/types/auth.type';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { RealTimeService } from 'src/app/services/realTime.service';
import { NotificationType } from 'src/app/types/notification';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IRestaurant, IReview } from 'src/app/types/restaurant.type';

enum Tabs {
  OVERVIEW = 0,
  REVIEWS = 1,
}

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
          <mat-tab-group
            [selectedIndex]="currentTabIndex"
            (selectedIndexChange)="handleTabChange($event)"
          >
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
  currentTabIndex = Tabs.OVERVIEW;

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
    private route: ActivatedRoute,
    private router: Router,
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

    this.route.queryParams.subscribe((params) => {
      const { tab } = params;
      if (tab === 'overview') {
        this.currentTabIndex = Tabs.OVERVIEW;
      } else if (tab === 'reviews') {
        this.currentTabIndex = Tabs.REVIEWS;
      }
    });
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
    }
  }

  async handleEditUserReview(editData: any) {
    const response = await this.userSv.updateReview(
      this.userReview?.id as string,
      this.rid,
      editData,
    );
    if (response) {
      this.userReview = response;
      // this.editting = false;
    }
  }

  async handleDeleteUserReview(reviewId: string) {
    await this.userSv.deleteReview(reviewId, this.rid);
    this.userReview = null;
  }
}
