export type IUser = {
  id: string;
  rid?: string;
  email: string;
  lastName: string;
  firstName: string;
  isOwner: boolean;
  createdAt?: string;
  favoriteCuisines?: string[];
  updatedAt?: string;
};

export type ILoginResponse = {
  exp: number;
  accessToken: string;
  refreshToken: string;
};

export enum UserType {
  OWNER = 'OWNER',
  CLIENT = 'CLIENT',
}
