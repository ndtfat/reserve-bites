import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IRestaurantCard } from 'src/app/types/restaurant.type';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'home',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      @keyframes go {
        0%,
        100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(10px);
        }
      }
      h4 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      .search {
        position: relative;
        height: 412px;

        .search-bg {
          height: 100%;
          background: url('../../../assets/backgrounds/search-2.jpeg') no-repeat
            0% 60%;
          background-size: cover;
          background-position: right 40%;
          // filter: blur(2px);
        }
        
        .search-body {
          position: absolute;
          left: 50%;
          top: 10%;
          transform: translateX(-50%);
          padding: 0 20px;
          @include flex(column, center, flex-start);
          .search-slogan {
            top: 16%;
            text-align: center;
            font-weight: 900;
            text-shadow: 2px 2px 4px #fff;
          }
          .form {
            width: 100%;
            border-radius: 4px;
            background-color: #fff;
            @include shadow;
          }
          .form > form > * {
            width: 100%;
          }
        }
      }
      .body {
        margin: 0 30px;
        padding: 30px 0;
        .sub-title {
          font-weight: 600;
          text-decoration: underline;
          margin-bottom: 20px;
          @include cursor;
          @include flex(row, center, flex-start);
          &:hover {
            color: $primary;
          }
          &:hover .icon {
            animation: go 0.8s ease-in-out infinite;
          }
        }
        .card-wrapper {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .locations {
          column-count: 2;
          li {
            break-inside: avoid;
            margin-bottom: 10px;
            @include cursor;
            transition: 0.2s;
          }
          li:hover {
            color: $primary;
          }
        }
      }
      .footer {
        background: #000;
        & > div {
          min-height: 250px;
          padding: 20px 50px;
          gap: 30px;
          @include flex(column, center, flex-start);
          .logo-lg {
            display: none;
          }
          .logo-sm {
            display: block;
          }
          .content {
            flex: 1;
          }
          .content p {
            width: 100%;
            color: #fff;
            margin-bottom: 6px;
            text-align: justify;
          }
          .content span {
            color: $primary;
          }
        }
      }

      @include mobile {
        .search-body {
          min-width: 100%;
        }
        .search-slogan {
          font-size: 30px;
          margin-bottom: 10px;
        }
        .search-body .form {
          padding: 16px;
        }
      }
      @include tablet {
        .search-body {
          min-width: unset;
        }
        .search-slogan {
          font-size: 50px;
          margin-bottom: 30px;
        }
        .search-body .form {
          padding: 20px 20px 0;
        }
        .search-body .form form {
          width: 100%;
          display: flex;
          gap: 10px;

          .form-field-size {
            flex: 2;
          }
          .form-field-select {
            flex: 3;
          }
          .form-button {
            flex: 1;
          }
        }
      }
      @include desktop {
        .body,
        .footer > div {
          width: $body-width;
          margin: 0 auto;
        }
        .body {
          .card-wrapper {
            grid-template-columns: repeat(4, 1fr);
          }
          .locations {
            column-count: 4;
          }
        }
        .footer {
          & > div {
            @include flex(row, center, flex-start);
            padding: 0;
            .logo-sm {
              display: none;
            }
            .logo-lg {
              display: block;
            }
          }
        }
      }
    `,
  ],
  template: `
    <!-- Search -->
    <div class="search">
      <div class="search-bg"></div>
      <div class="search-body">
        <h1 class="search-slogan">Reserve your bites at the best restaurants</h1>
        <div class="form">
          <form>
            <mat-form-field class="form-field-size">
              <mat-label>Size</mat-label>
              <input matInput type="number"><mat-hint style="display: none;">asdas</mat-hint>
            </mat-form-field>
            
            <app-select
              class="form-field-select"
              label="Open day"
              appearance="fill"
              [options]="dayOptions"
            />
            <button 
              class="form-button"
              mat-raised-button 
              color="primary" 
              style="height: 56px;"
            >
              Find a table
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="body-wrapper">
      <div class="body">
        <div>
          <h3>Restaurants most people like</h3>
          <alert *ngIf="errorTopRateRestaurants" type="error">
            {{ errorTopRateRestaurants }}
          </alert>
          <div class="card-wrapper" *ngIf="topRateRestaurants">
            <restaurant-card
              *ngFor="let restaurant of topRateRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>

        <div *ngIf="isAuthenicated" style="margin-top: 50px;">
          <h3>Maybe you will like</h3>
          <alert *ngIf="errorSuggestRestaurants" type="error">
            {{ errorSuggestRestaurants }}
          </alert>
          <div class="card-wrapper" *ngIf="suggestRestaurants">
            <restaurant-card
              *ngFor="let restaurant of suggestRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>

        <div *ngIf="isAuthenicated" style="margin-top: 50px;">
          <h3>Explore more in your place</h3>
          <alert *ngIf="errorLocalRestaurants" type="error">
            {{ errorLocalRestaurants }}
          </alert>
          <div class="card-wrapper" *ngIf="localRestaurants">
            <restaurant-card
              *ngFor="let restaurant of localRestaurants"
              [restaurant]="restaurant"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="footer">
      <div>
        <logo color="white" text class="logo-lg" />
        <logo color="white" [width]="80" class="logo-sm" />
        <div class="content">
          <p>This website made by <span>"fat" nguyen</span>.</p>
          <p>
            This website using <span>Angular</span> and <span>NodeJs</span>.
          </p>
          <p>
            If you interested in this website. You can refrence source code
            <span>here</span>.
          </p>
          <p>
            If you are using with function like <span>create restaurant</span>,
            <span>create reservation, review,</span>... something may
            <span>affect to data</span>. Please enter reasonable information.
            Avoid creating data that does not match the concept of the website.
            <span>Thank you ❤</span>
          </p>
        </div>
      </div>
    </div> -->
  `,
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private restaurntSv: RestaurantService, private auth: AuthService) { }

  isAuthenicated = false;
  errorLocalRestaurants = "";
  errorTopRateRestaurants = '';
  errorSuggestRestaurants = '';
  localRestaurants!: IRestaurantCard[];
  topRateRestaurants!: IRestaurantCard[];
  suggestRestaurants!: IRestaurantCard[];

  dayOptions = [
    'Monday',
    'Tuesday',
    'Wendsday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => {
    return { value: day.substring(0, 3), content: day };
  });

  async ngOnInit() {
    this.auth.isAuthenticated.subscribe(value => this.isAuthenicated = value)

    const [topRateRes, suggestRes, localRes] = await Promise.all([
      this.restaurntSv.getTopRateRestaurants(),
      this.restaurntSv.getSuggestRestaurants(),
      this.restaurntSv.getLocalRestaurants(),
    ])

    console.log({ topRateRes, suggestRes, localRes })

    const {
      itemsList: topRateRestaurants,
      error: topRateRestaurantsError
    } = topRateRes;
    this.topRateRestaurants = topRateRestaurants;
    this.errorTopRateRestaurants = topRateRestaurantsError || '';

    const {
      itemsList: suggestRestaurants,
      error: suggestRestaurantsError,
    } = suggestRes;
    this.suggestRestaurants = suggestRestaurants;
    this.errorSuggestRestaurants = suggestRestaurantsError || '';


    const {
      itemsList: localRestaurants,
      error: localRestaurantsError,
    } = localRes;
    this.localRestaurants = localRestaurants;
    this.errorLocalRestaurants = localRestaurantsError || '';
  }

  handleFind(query: string, value: string) {
    console.log({ query, value });
    if (value !== '') {
      this.router.navigateByUrl(`/restaurant/search?${query}=${value}`);
    }
  }
}
