import { IUser } from './auth.type';

export type IDish = {
  name: string;
  price: number;
};

export type IMenuCategory = {
  category: string;
  dishes: IDish[];
};

export type IImageType = {
  id: string;
  name: string;
  url: string;
};

export type IRestaurant = {
  id: string;
  owner: IUser;
  name: string;
  description: string;
  address: {
    detail: string;
    province: string;
    country: string;
  };
  currency: string;
  menu: IMenuCategory[];
  operationTime: {
    openTime: string | Date;
    closeTime: string | Date;
    openDay: string[];
  };
  maxReservationSize: number;
  mainImage: IImageType;
  gallery: IImageType[];
  rate: number;
  events: IRestaurantEvent[];
};

export type IFormOwnerInformationType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type IFormRestaurantInformationType = {
  name: string;
  description: string;
  address: {
    detail: string;
    province: string;
    country: string;
  };
  currency: string;
  menu: IMenuCategory[];
  operationTime: {
    openTime: Date;
    closeTime: Date;
    openDay: string[];
  };
  maxReservationSize: number;
  mainImage: IImageType;
  gallery: IImageType[];
};

export type IRestaurantCard = {
  id: string;
  name: string;
  address: {
    detail: string;
    province: string;
    country: string;
  };
  currency: string;
  minPrice: number;
  maxPrice: number;
  operationTime: {
    openTime: string | Date;
    closeTime: string | Date;
    openDay: string[];
  };
  mainImage: {
    name: string;
    url: string;
  };
  rate: number;
  owner?: string;
  maxReservationSize?: number;
};

export type IReview = {
  id: string;
  diner: IUser;
  food: number;
  service: number;
  ambiance: number;
  overall: number;
  content: string;
  createdAt: Date;
};

export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  RESPONDING = 'responding',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export type IReservation = {
  id: string;
  restaurant: IRestaurant;
  diner: IUser;
  size: number;
  time: Date;
  date: Date;
  status: ReservationStatus;
  versions: {
    time: Date | string;
    date: Date | string;
    size: number;
    createdAt: Date | string;
    status: ReservationStatus;
  }[];
  cancelMessage: { message: string; createdAt: Date | string };
};

export type IRestaurantEvent = {
  id: string;
  name: string;
  restaurant: IRestaurant;
  endDate: Date | string;
  desc: string;
  poster: IImageType;
};
