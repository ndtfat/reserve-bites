import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../types/auth.type';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient, private auth: AuthService) { }

  async editProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<IUser> {
    const newUserInfo = await lastValueFrom(
      this.http.put<IUser>(this.SERVER_URL + '/user/edit', data)
    );

    this.auth.user.next(newUserInfo);
    return newUserInfo;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    await lastValueFrom(
      this.http.put(this.SERVER_URL + '/user/change-password', {
        oldPassword,
        newPassword,
      })
    );
  }

  async getReservations(filterOptions: { text: string; status: string; page: number; }) {
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
        .get<{ page: number; totalItems: number; itemsList: any[] }>(this.SERVER_URL + path, { params })
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
          })
        )
    );

    return response;
  }
}
