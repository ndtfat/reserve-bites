import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../types/auth.type';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { IReview } from '../types/restaurant.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private _snackbar: SnackbarService,
  ) {}

  async editProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<IUser> {
    const newUserInfo = await lastValueFrom(
      this.http.put<IUser>(this.SERVER_URL + '/user/edit', data),
    );

    this.auth.user.next(newUserInfo);
    return newUserInfo;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    await lastValueFrom(
      this.http.put(this.SERVER_URL + '/user/change-password', {
        oldPassword,
        newPassword,
      }),
    );
  }

  async getReservations(filterOptions: {
    text: string;
    status: string;
    page: number;
  }) {
    const isOwner = this.auth.user.value?.isOwner;
    const path = isOwner
      ? `/restaurant/${this.auth.user.value?.rid}/reservations`
      : `/user/reservations`;

    const { status, text, page } = filterOptions;
    const params = new HttpParams()
      .set('status', status)
      .set('text', text)
      .set('page', page);

    const response = await lastValueFrom(
      this.http
        .get<{ page: number; totalItems: number; itemsList: any[] }>(
          this.SERVER_URL + path,
          { params },
        )
        .pipe(
          map((res) => {
            let { page, totalItems, itemsList } = res;
            if (isOwner) {
              itemsList = itemsList.map((item: any) => {
                return {
                  id: item._id,
                  diner: item.diner.firstName + ' ' + item.diner.lastName,
                  email: item.diner.email,
                  size: item.size,
                  date: item.createdAt,
                  time: item.time,
                  status: item.status,
                };
              });
            }

            return { page, totalItems, itemsList };
          }),
        ),
    );

    return response;
  }

  async reserve(payload: {
    rid: string;
    dinerId: string;
    size: number;
    date: Date;
    time: Date;
  }) {
    const res = await lastValueFrom(
      this.http.post<any>(this.SERVER_URL + '/user/reservation', payload),
    );
    this._snackbar.open('success', 'You have maked a reservation successfully');
    this.router.navigateByUrl('/reservation/' + res?.reservationId);
  }

  async review(payload: {
    rid: string;
    dinerId: string;
    food: number;
    service: number;
    ambiance: number;
    content: string;
  }) {
    const response = await lastValueFrom(
      this.http.post<IReview>(this.SERVER_URL + '/user/review', payload).pipe(
        map((res) => {
          res.overall = (res.ambiance + res.food + res.service) / 3;
          return res;
        }),
      ),
    );
    this._snackbar.open('success', 'Your review has been posted successfully');
    return response;
  }

  async updateReview(
    id: string,
    payload: {
      food: number;
      service: number;
      ambiance: number;
      content: string;
    },
  ) {
    const response = await lastValueFrom(
      this.http
        .put<IReview>(this.SERVER_URL + '/user/review/' + id, payload)
        .pipe(
          map((res) => {
            res.overall = (res.ambiance + res.food + res.service) / 3;
            return res;
          }),
        ),
    );
    this._snackbar.open('success', 'Your review has been updated successfully');
    return response;
  }

  async deleteReview(id: string) {
    try {
      await lastValueFrom(
        this.http.delete(this.SERVER_URL + '/user/review/' + id),
      );

      this._snackbar.open(
        'success',
        'You have deleted your review successfully',
      );
    } catch (error) {
      console.log(error);
      this._snackbar.open('error', 'You have failed to delete your review');
    }
  }
}
