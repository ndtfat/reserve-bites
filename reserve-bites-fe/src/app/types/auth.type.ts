export type IUser = {
  id: string;
  rid?: string;
  email: string;
  lastName: string;
  firstName: string;
  isOwner: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ILoginResponse = {
  exp: number;
  accessToken: string;
  refreshToken: string;
};
