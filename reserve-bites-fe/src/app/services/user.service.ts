import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, lastValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser, UserType } from '../types/auth.type';
import { INotification, NotificationType } from '../types/notification';
import { IReservation, IRestaurant, IReview } from '../types/restaurant.type';
import { notificationMessage } from '../utils/notification';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { RealTimeService } from './realTime.service';
import { ChatRole, IChatBox } from '../types/chat.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private socket: RealTimeService,
    private realTime: RealTimeService,
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

  async getReservations(filterOptions: { text: string; status: string; page: number }) {
    const isOwner = this.auth.user.value?.isOwner;
    const path = isOwner
      ? `/restaurant/${this.auth.user.value?.rid}/reservations`
      : `/user/reservations`;

    const { status, text, page } = filterOptions;
    const params = new HttpParams().set('status', status).set('text', text).set('page', page);

    const response = await lastValueFrom(
      this.http
        .get<{ page: number; totalItems: number; itemsList: any[] }>(this.SERVER_URL + path, {
          params,
        })
        .pipe(
          map((res) => {
            let { page, totalItems, itemsList } = res;
            if (isOwner) {
              itemsList = itemsList.map((item: IReservation) => {
                return {
                  id: item.id,
                  diner: item.diner.firstName + ' ' + item.diner.lastName,
                  email: item.diner.email,
                  size: item.size,
                  date: item.date,
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

  async reserve(payload: { rid: string; dinerId: string; size: number; date: Date; time: Date }) {
    try {
      const res = await lastValueFrom(
        this.http.post<{ reservationId: string }>(this.SERVER_URL + '/user/reservation', payload),
      );

      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: payload.rid,
          reservationId: res.reservationId,
        },
        type: NotificationType.MAKE_RESERVATION,
      });

      this._snackbar.open('success', 'You have made a reservation successfully');
      this.router.navigateByUrl('/reservation/' + res?.reservationId);
    } catch (error) {}
  }

  async review(payload: {
    rid: string;
    dinerId: string;
    food: number;
    service: number;
    ambiance: number;
    content: string;
  }) {
    try {
      const response = await lastValueFrom(
        this.http.post<IReview>(this.SERVER_URL + '/user/review', payload).pipe(
          map((res) => {
            res.overall = (res.ambiance + res.food + res.service) / 3;
            return res;
          }),
        ),
      );
      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: payload.rid,
        },
        type: NotificationType.POST_REVIEW,
      });
      this._snackbar.open('success', 'Your review has been posted successfully');
      return response;
    } catch (error) {
      return null;
    }
  }

  async updateReview(
    id: string,
    rid: string,
    payload: {
      food: number;
      service: number;
      ambiance: number;
      content: string;
    },
  ) {
    try {
      const response = await lastValueFrom(
        this.http.put<IReview>(this.SERVER_URL + '/user/review/' + id, payload).pipe(
          map((res) => {
            res.overall = (res.ambiance + res.food + res.service) / 3;
            return res;
          }),
        ),
      );
      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: rid,
        },
        type: NotificationType.UPDATE_REVIEW,
      });
      this._snackbar.open('success', 'Your review has been updated successfully');
      return response;
    } catch (erorr) {
      return null;
    }
  }

  async deleteReview(uid: string, rid: string) {
    try {
      await lastValueFrom(this.http.delete(this.SERVER_URL + '/user/review/' + uid));
      this.socket.sendNotification({
        senderId: this.auth.user.value?.id as string,
        receiver: {
          type: UserType.OWNER,
          rid: rid,
        },
        type: NotificationType.DELETE_REVIEW,
      });
      this._snackbar.open('success', 'You have deleted your review successfully');
    } catch (error) {
      console.log(error);
      this._snackbar.open('error', 'You have failed to delete your review');
    }
  }

  async getNotifications(page = 1, sortBy = 'desc') {
    const params = new HttpParams().set('sortBy', sortBy).set('page', page);

    const response = await lastValueFrom(
      this.http
        .get<{
          page: number;
          totalPages: number;
          itemsList: INotification[];
          totalItems: number;
        }>(this.SERVER_URL + `/user/notifications`, {
          params,
        })
        .pipe(
          map((res) => {
            const itemsList = res.itemsList.map((item) => ({
              ...item,
              title:
                (item.sender as IRestaurant)?.name ||
                (item.sender as IUser).firstName + (item.sender as IUser).lastName,
              message: notificationMessage[item.type],
            }));

            return { ...res, itemsList };
          }),
        ),
    );

    return response;
  }

  async markNotificationsAsReaded(notifIds: string[]) {
    return this.http
      .put(this.SERVER_URL + '/user/notifications/mark-as-readed', { notifIds })
      .subscribe({
        next: () => console.log('Mask notifs as readed'),
        error: (error) => console.log(error),
      });
  }

  async deleteNotifications(notifIds: string[]) {
    return this.http
      .delete(this.SERVER_URL + '/user/notifications', { body: { notifIds } })
      .subscribe({
        next: () => this._snackbar.open('success', 'You have deleted notification(s) successfully'),
        error: (error) => console.log(error),
      });
  }

  async createChatBox(payload: { senderId: string; receiverId: string }) {
    return await lastValueFrom(
      this.http.post<{ chatBoxId: string }>(this.SERVER_URL + '/user/chat-box', payload),
    );
  }

  getChatBoxes(): Observable<IChatBox[]> {
    return this.http.get(this.SERVER_URL + '/user/chat-box').pipe(
      map((res: any) => {
        console.log(res);

        res = res.map((item: any) => {
          const userChatWith = item.userChatWith;
          const user = this.auth.user.value;
          const messages = item.messages.map((mess: any) => ({
            sender: user?.id === mess.senderId ? ChatRole.ME : ChatRole.YOU,
            content: mess.message,
            createdAt: new Date(mess.createdAt),
          }));

          if (!item.usersReaded.includes(user?.id)) {
            this.realTime.numUnReadChatBox.next(this.realTime.numUnReadChatBox.value + 1);
          }

          return {
            id: item.id,
            chatWithId: user?.isOwner ? userChatWith.id : userChatWith.ownerId,
            name: user?.isOwner
              ? `${userChatWith.firstName} ${userChatWith.lastName}`
              : userChatWith.name,
            messages,
            avatarUrl: user?.isOwner ? '' : userChatWith.mainImage.url,
            createdAt: item.createdAt,
            readed: item.usersReaded.includes(user?.id),
          };
        });

        return res;
      }),
    );
  }

  markChatBoxReaded(id: string) {
    console.log(id);
    this.http
      .put(this.SERVER_URL + '/user/read-message', {
        conversationId: id,
        uid: this.auth.user.value?.id,
      })
      .subscribe((res) => console.log(res));
  }
}
