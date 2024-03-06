import { Routes } from '@angular/router';

// layouts
import { AuthComponent as AuthLayout } from './layouts/auth.component';
import { HeaderComponent as HeaderLayout } from './layouts/header.component';

// guards
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { OwnerGuard } from './guards/owner.guard';
import { DinerGuard } from './guards/diner.guard';

// auth pages
import { Page404Component } from './pages/error/page-404.component';
import { SignInComponent as SignInPage } from './pages/auth/sign-in.component';
import { SignUpComponent as SignUpPage } from './pages/auth/sign-up.component';
import { ResetPasswordComponent as ResetPasswordPage } from './pages/auth/reset-password.component';

import { SearchComponent } from './pages/restaurant/search.component';
import { AccountComponent } from './pages/account/account.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { HomeComponent as HomePage } from './pages/home/home.component';
import { RestaurantRegisterComponent } from './pages/auth/restaurant-register.component';

// GuestGuard is used for getUser() run when a user access to website
// the getUser() is for purpose sign in if this user already signed

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HeaderLayout,
    canActivate: [GuestGuard, DinerGuard],
    children: [{ path: '', component: HomePage }],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'sign-in', component: SignInPage },
      { path: 'sign-up', component: SignUpPage },
      { path: 'reset-password', component: ResetPasswordPage },
    ],
  },
  { path: 'restaurant-register', component: RestaurantRegisterComponent },
  {
    path: 'account',
    component: HeaderLayout,
    canActivate: [GuestGuard, AuthGuard],
    children: [{ path: ':id', component: AccountComponent }],
  },
  {
    path: 'restaurant',
    component: HeaderLayout,
    canActivate: [GuestGuard],
    children: [
      { path: 'search', component: SearchComponent },
      { path: ':id', component: RestaurantComponent },
    ],
  },
  {
    path: 'reservation',
    component: HeaderLayout,
    canActivate: [GuestGuard],
    children: [{ path: ':id', component: ReservationComponent }],
  },
  {
    path: 'notification',
    component: HeaderLayout,
    canActivate: [GuestGuard],
    children: [{ path: '', component: NotificationComponent }],
  },

  { path: '**', component: Page404Component },
  { path: '404', component: Page404Component },
];

export default routes;
