import { ReservationStatus } from "./restaurant.type"

export enum AlertType {
  WARN = 'warn',
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}


export enum NotificationType {
  RESERVATION = "reservation",
}

export type INotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: '';
  readed: boolean;
  status?: ReservationStatus | string;
}