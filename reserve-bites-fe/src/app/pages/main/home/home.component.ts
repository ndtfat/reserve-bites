import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IRestaurantCard, IRestaurantEvent } from 'src/app/types/restaurant.type';
import { dayOptions } from 'src/app/utils/form';
import { FormHomeSearchComponent } from '../../components/forms/form-home-search.component';
import { HomeSectionSuggestComponent } from './components/home-section-suggest.component';
import { HomeSectionRestaurantOwnerComponent } from './components/home-section-restaurant-owner.component';
import { HomeSectionEventsComponent } from './components/home-section-events.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormHomeSearchComponent,
    HomeSectionRestaurantOwnerComponent,
    HomeSectionEventsComponent,
    HomeSectionSuggestComponent,
  ],
  styles: [
    `
      @import '../../../scss/common.scss';
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
      .search {
        position: relative;
        height: 420px;

        .search-bg {
          width: 100vw;
          height: 100%;
          background: url('../../../../assets/backgrounds/search-2.jpeg') no-repeat 0% 60%;
          background-size: cover;
          background-position: right 50%;
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
        }
      }
      .body {
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 50px;
      }

      @include mobile {
        .search-body {
          min-width: 100%;
          .form {
            padding: 16px;
          }
        }
        .search-slogan {
          font-size: 30px;
          margin-bottom: 10px;
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
    <!-- Search -->
    <div class="search">
      <div class="search-bg"></div>
      <div class="search-body">
        <h1 class="search-slogan">Reserve your bites at the best restaurants</h1>
        <div class="form">
          <form-home-search (search)="handleSearch($event)" />
        </div>
      </div>
    </div>

    <div class="body">
      <home-section-events [events]="events" />

      <home-section-suggest
        [localRestaurants]="localRestaurants"
        [topRateRestaurants]="topRateRestaurants"
        [suggestRestaurants]="suggestRestaurants"
        [errorLocalRestaurants]="errorLocalRestaurants"
        [errorTopRateRestaurants]="errorTopRateRestaurants"
        [errorSuggestRestaurants]="errorSuggestRestaurants"
      />

      <home-section-restaurant-owner />
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private restaurantSv: RestaurantService,
  ) {}

  searchForm = this.fb.group({
    size: [1],
    openDay: [''],
  });
  isAuthenicated = false;
  errorLocalRestaurants = '';
  errorTopRateRestaurants = '';
  errorSuggestRestaurants = '';
  localRestaurants!: IRestaurantCard[];
  topRateRestaurants!: IRestaurantCard[];
  suggestRestaurants!: IRestaurantCard[];
  events: IRestaurantEvent[] = [];

  dayOptions = dayOptions;

  async ngOnInit() {
    this.auth.isAuthenticated.subscribe((value) => (this.isAuthenicated = value));

    const [topRateRes, suggestRes, localRes, events] = await Promise.all([
      this.restaurantSv.getTopRateRestaurants(),
      this.restaurantSv.getSuggestRestaurants(),
      this.restaurantSv.getLocalRestaurants(),
      this.restaurantSv.getEvents(),
    ]);

    // console.log({ topRateRes, suggestRes, localRes });

    this.events = events;

    const { itemsList: topRateRestaurants, error: topRateRestaurantsError } = topRateRes;
    this.topRateRestaurants = topRateRestaurants;
    this.errorTopRateRestaurants = topRateRestaurantsError || '';

    const { itemsList: suggestRestaurants, error: suggestRestaurantsError } = suggestRes;
    this.suggestRestaurants = suggestRestaurants;
    this.errorSuggestRestaurants = suggestRestaurantsError || '';

    const { itemsList: localRestaurants, error: localRestaurantsError } = localRes;
    this.localRestaurants = localRestaurants;
    this.errorLocalRestaurants = localRestaurantsError || '';
  }

  handleSearch(filter: { size: number | undefined; openDay: string | undefined }) {
    let queryString = '';
    const { size, openDay } = filter;

    if (size) {
      queryString += `size=${size}`;
    }

    if (openDay) {
      if (queryString !== '') {
        queryString += '&';
      }
      queryString += `openDay=${openDay}`;
    }

    if (queryString !== '') {
      console.log({ size, openDay });
      this.router.navigateByUrl(`/restaurant/search?${queryString}`);
    }
  }
}
