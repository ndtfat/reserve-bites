import { IUser, UserType } from './auth.type';
import { ReservationStatus } from './restaurant.type';

export enum AlertType {
  WARN = 'warn',
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum NotificationType {
  RESERVATION = 'RESERVATION',
  POST_REVIEW = 'POST_REVIEW',
  DELETE_REVIEW = 'DELETE_REVIEW',
  UPDATE_REVIEW = 'UPDATE_REVIEW',
}

export type INotification = {
  id: string;
  type: NotificationType;
  sender: IUser;
  readed: boolean;
  title: string;
  message: string;
  createdAt: Date | string;
  additionalInfo: {
    rid?: string;
    reervationId?: string;
  };
};

export type ISocketNotification = {
  senderId: string;
  receiver: {
    uid?: string;
    rid?: string;
    type: UserType;
  };
  type: NotificationType;
};
