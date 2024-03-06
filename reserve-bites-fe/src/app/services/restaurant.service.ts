import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { findMaxPrice, findMinPrice } from '../utils/find';
import {
  IRestaurant,
  IRestaurantCard,
  IReview,
} from '../types/restaurant.type';
import {
  IFormOwnerInformationType,
  IFormRestaurantInformationType,
} from './../types/restaurant.type';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private _snackbar: SnackbarService,
  ) {}

  async register(payload: {
    owner: IFormOwnerInformationType;
    restaurant: IFormRestaurantInformationType;
  }) {
    this.http
      .post(this.SERVER_URL + '/restaurant/register', payload)
      .subscribe((response) => {
        console.log(response);
        this._snackbar.open(
          'success',
          'You have register restaurant successfully',
        );
        this.router.navigateByUrl('/');
      });
  }

  getRestaurant(id: string) {
    return this.http.get<IRestaurant>(this.SERVER_URL + `/restaurant/${id}`);
  }

  async update(updatedData: any) {
    return lastValueFrom(
      this.http.put<IRestaurant>(this.SERVER_URL + `/restaurant`, {
        restaurant: updatedData,
      }),
    );
  }

  async getTopRateRestaurants() {
    try {
      const restaurants = await lastValueFrom(
        this.http.get<IRestaurant[]>(this.SERVER_URL + '/restaurant/top-rate'),
      );

      const formatedRestaurants = restaurants.map((restaurant: IRestaurant) => {
        const formatRes: IRestaurantCard = {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          currency: restaurant.currency,
          minPrice: findMinPrice(restaurant.menu),
          maxPrice: findMaxPrice(restaurant.menu),
          operationTime: {
            ...restaurant.operationTime,
          },
          mainImage: restaurant.mainImage,
          rate: restaurant.rate,
        };

        return formatRes;
      });

      return { itemsList: formatedRestaurants, error: null };
    } catch (error: any) {
      return { itemsList: [], error: error.message };
    }
  }

  async getSuggestRestaurants() {
    try {
      const restaurants = await lastValueFrom(
        this.http.get<IRestaurant[]>(
          this.SERVER_URL + '/restaurant/suggest-for-user',
        ),
      );

      const formatedRestaurants = restaurants.map((restaurant: IRestaurant) => {
        const formatRes: IRestaurantCard = {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          currency: restaurant.currency,
          minPrice: findMinPrice(restaurant.menu),
          maxPrice: findMaxPrice(restaurant.menu),
          operationTime: {
            ...restaurant.operationTime,
          },
          mainImage: restaurant.mainImage,
          rate: restaurant.rate,
        };

        return formatRes;
      });

      return { itemsList: formatedRestaurants, error: null };
    } catch (error: any) {
      return { itemsList: [], error: error.message };
    }
  }

  async getLocalRestaurants() {
    try {
      const restaurants = await lastValueFrom(
        this.http.get<IRestaurant[]>(this.SERVER_URL + '/restaurant/local'),
      );

      const formatedRestaurants = restaurants.map((restaurant: IRestaurant) => {
        const formatRes: IRestaurantCard = {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          currency: restaurant.currency,
          minPrice: findMinPrice(restaurant.menu),
          maxPrice: findMaxPrice(restaurant.menu),
          operationTime: {
            ...restaurant.operationTime,
          },
          mainImage: restaurant.mainImage,
          rate: restaurant.rate,
        };

        return formatRes;
      });

      return { itemsList: formatedRestaurants, error: null };
    } catch (error: any) {
      return { itemsList: [], error: error.message };
    }
  }

  async getReviews(rid: string, page = 1, sortBy = 'desc') {
    const params = new HttpParams()
      .set('sortBy', sortBy)
      .set('page', page)
      .set('uid', this.auth.user.value?.id || '');

    return await lastValueFrom(
      this.http.get<{
        page: number;
        totalPages: number;
        itemsList: IReview[];
        userItem: IReview | null;
      }>(this.SERVER_URL + `/restaurant/${rid}/reviews`, { params }),
    );
  }

  async search(
    name: string = '',
    address: string = '',
    size: number = 1,
    minRate: number = 0,
    maxRate: number = 5,
    openDay: string = '',
    page: number = 1,
  ) {
    try {
      const params = new HttpParams()
        .set('name', name)
        .set('address', address)
        .set('size', size)
        .set('rate', `${minRate},${maxRate}`)
        .set('openDay', openDay)
        .set('page', page);

      let { totalItems, itemsList } = await lastValueFrom(
        this.http.get<{ page: number; totalItems: number; itemsList: any[] }>(
          this.SERVER_URL + '/restaurant/search',
          {
            params,
          },
        ),
      );

      itemsList = itemsList.map((item) => ({
        _id: item._id,
        name: item.name,
        address: item.address,
        currency: item.currency,
        minPrice: findMinPrice(item.menu),
        maxPrice: findMaxPrice(item.menu),
        operationTime: {
          ...item.operationTime,
        },
        mainImage: item.mainImage,
        rate: item.rate,
      }));
      return { page, totalItems, itemsList, error: null };
    } catch (error: any) {
      return { page, totalItems: 0, itemsList: [], error: error?.message };
    }
  }
}
