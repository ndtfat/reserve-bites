import { Route } from '@angular/router';
import { AuthComponent as AuthLayout } from '../layouts/auth.component';
import { SignInComponent } from '../pages/main/auth/sign-in.component';
import { SignUpComponent } from '../pages/main/auth/sign-up.component';
import { ResetPasswordComponent } from '../pages/main/auth/reset-password.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ],
  },
];
