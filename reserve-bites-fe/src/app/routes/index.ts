import { Routes } from '@angular/router';
import { HeaderComponent } from '../layouts/header.component';
import { GuestGuard } from '../guards/guest.guard';
import { DinerGuard } from '../guards/diner.guard';
import { AuthGuard } from '../guards/auth.guard';

// layouts

// GuestGuard is used for getUser() run when a user access to website
// the getUser() is for purpose sign in if this user already signed

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'restaurant-register',
    loadComponent: () =>
      import('../pages/auth/restaurant-register.component').then(
        (m) => m.RestaurantRegisterComponent,
      ),
  },
  {
    path: '',
    component: HeaderComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [DinerGuard],
        loadComponent: () =>
          import('../pages/main/home/home.component').then((m) => m.HomeComponent),
      },

      {
        path: 'account',
        canActivate: [AuthGuard],
        loadChildren: () => import('./account.routes').then((m) => m.ACCOUNT_ROUTES),
      },
      {
        path: 'restaurant',
        loadChildren: () => import('./restaurant.routes').then((m) => m.RESTAURANT_ROUTES),
      },
      {
        path: 'reservation',
        loadChildren: () => import('./reservation.routes').then((m) => m.RESERVATION_ROUTES),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('../pages/main/notification/notification.component').then(
            (m) => m.NotificationComponent,
          ),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('../pages/error/page-404.component').then((m) => m.Page404Component),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../pages/error/page-404.component').then((m) => m.Page404Component),
  },
];

export default routes;
