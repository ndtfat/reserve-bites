import { Route } from '@angular/router';
import { AccountComponent } from '../pages/main/account/account.component';

export const ACCOUNT_ROUTES: Route[] = [{ path: ':id/:tab', component: AccountComponent }];
