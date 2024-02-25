import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ILoginResponse, IUser } from '../types/auth.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<IUser | undefined>(undefined);
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient, private router: Router) { }

  async getUser() {
    try {
      const userInfo = await lastValueFrom(this.http.get<IUser>(this.SERVER_URL + '/user/me'));
      this.user.next(userInfo);
      this.isAuthenticated.next(true);
    } catch (error) {
      // console.log(error);
      this.isAuthenticated.next(false);
    }
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    address: string,
    favoriteCuisines: string[]
  ) {
    try {
      const response = await lastValueFrom(
        this.http.post(this.SERVER_URL + '/auth/sign-up', {
          firstName,
          lastName,
          email,
          password,
          address,
          favoriteCuisines
        })
      );
      this.router.navigateByUrl('/auth/sign-in');
      return { response, error: null };
    } catch (error: any) {
      return { response: null, error: error.message };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await lastValueFrom(
        this.http.post<ILoginResponse>(this.SERVER_URL + '/auth/sign-in', {
          email,
          password,
        })
      );

      localStorage.setItem('accessToken', response.accessToken);
      await this.getUser();

      this.isAuthenticated.next(true);
      this.router.navigateByUrl('/');
      return { response, error: null }
    } catch (error: any) {
      console.log(error)
      return { response: null, error: error.error.message }
    }
  }

  async signOut() {
    try {
      const response = await lastValueFrom(this.http.post(this.SERVER_URL + '/auth/sign-out', {}));
      this.isAuthenticated.next(false);
      this.router.navigateByUrl('/auth/sign-in');
      localStorage.clear();

      return { response, error: null };
    } catch (error: any) {
      return { response: null, error: error.message };
    }
  }

  async sendResetPasswordMail(email: string) {
    try {
      const res = await lastValueFrom(
        this.http.post(this.SERVER_URL + '/auth/send-reset-password-mail', { email })
      )
      return { response: res, error: null };
    } catch (error: any) {
      console.log(error);
      return { response: null, error: error.error.message };
    }
  }

  async resetPassword(uid: string, token: string, newPw: string) {
    try {
      const res = await lastValueFrom(
        this.http.post(this.SERVER_URL + `/auth/reset-password/${uid}/${token}`, { password: newPw })
      )
      return { response: res, error: null };
    } catch (error: any) {
      return { response: null, error: error.error.message };
    }
  }
}
