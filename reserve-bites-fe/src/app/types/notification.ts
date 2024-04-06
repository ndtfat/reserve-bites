import { IUser, UserType } from './auth.type';
import { IRestaurant, ReservationStatus } from './restaurant.type';

export enum AlertType {
  WARN = 'warn',
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum NotificationType {
  MAKE_RESERVATION = 'MAKE_RESERVATION',
  UPDATE_RESERVATION = 'UPDATE_RESERVATION',
  CANCEL_RESERVATION = 'CANCEL_RESERVATION',
  REJECT_RESERVATION = 'REJECT_RESERVATION',
  CONFIRM_RESERVATION = 'CONFIRM_RESERVATION',
  POST_REVIEW = 'POST_REVIEW',
  DELETE_REVIEW = 'DELETE_REVIEW',
  UPDATE_REVIEW = 'UPDATE_REVIEW',
}

export type INotification = {
  id: string;
  type: NotificationType;
  sender: IUser | IRestaurant;
  readed: boolean;
  title: string;
  message: string;
  createdAt: Date | string;
  additionalInfo: {
    rid?: string;
    reservationId?: string;
  };
};

export type ISocketNotification = {
  senderId: string;
  receiver: {
    uid?: string;
    rid?: string;
    reservationId?: string;
    type: UserType;
  };
  type: NotificationType;
};
