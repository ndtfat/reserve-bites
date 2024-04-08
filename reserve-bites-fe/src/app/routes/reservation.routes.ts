import { Route } from '@angular/router';
import { ReservationComponent } from '../pages/main/reservation/reservation.component';

export const RESERVATION_ROUTES: Route[] = [
  {
    path: '',
    children: [{ path: ':id', component: ReservationComponent }],
  },
];
