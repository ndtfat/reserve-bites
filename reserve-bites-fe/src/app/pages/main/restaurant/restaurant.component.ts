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
import { NgIf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RestaurantTabOverviewComponent } from 'src/app/pages/components/tabs/restaurant-tab-overview.component';
import { RestaurantTabReviewsComponent } from 'src/app/pages/components/tabs/restaurant-tab-reviews.component';
import { FormReservationComponent } from 'src/app/pages/components/forms/form-reservation.component';

enum Tabs {
  OVERVIEW = 0,
  REVIEWS = 1,
}

@Component({
  selector: 'restaurant',
  standalone: true,
  imports: [
    NgIf,
    MatTabsModule,
    RestaurantTabOverviewComponent,
    RestaurantTabReviewsComponent,
    FormReservationComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
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
      .reservation-form {
        width: 34%;
        padding: 10px 16px 20px;
        position: sticky;
        top: calc($header-height + 60px);
        @include shadow;
        background: #fff;
        border-radius: 4px;
        h5 {
          padding: 6px 0 16px;
          text-align: center;
          font-weight: 600;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
        }
        .overlay {
          @include overlayLock;
        }
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

        <div class="reservation-form">
          <h5>Make a reservation</h5>
          <form-reservation [restaurant]="restaurant" />
          <div *ngIf="!canMakeReservation" class="overlay">
            Reservation can only be made by diners
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RestaurantComponent implements OnInit {
  rid!: string;
  restaurant!: IRestaurant;
  currentTabIndex = Tabs.OVERVIEW;
  canMakeReservation = true;

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

    auth.user.subscribe((u) => {
      if (!u) {
        this.canMakeReservation = false;
      } else if (u && u.isOwner) {
        this.canMakeReservation = false;
      } else {
        this.canMakeReservation = true;
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
