import { Route } from '@angular/router';
import { AccountComponent } from '../pages/account/account.component';

export const ACCOUNT_ROUTES: Route[] = [
  {
    path: '',
    children: [{ path: ':id', component: AccountComponent }],
  },
];
