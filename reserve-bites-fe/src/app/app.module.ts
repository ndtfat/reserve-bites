import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import routes from './routes';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

import { heroClock } from '@ng-icons/heroicons/outline';
import { heroUserCircleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';
import {
  ionClose,
  ionImage,
  ionArrowRedo,
  ionBugOutline,
  ionCashOutline,
  ionPersonOutline,
  ionLogInOutline,
  ionLogOutOutline,
  ionWarningOutline,
  ionLocationOutline,
  ionPricetagOutline,
  ionCloudUploadOutline,
  ionAlertCircleOutline,
  ionDocumentTextOutline,
  ionCheckmarkCircleOutline,
  ionChatbubbleEllipsesOutline,
  ionInformationCircleOutline,
} from '@ng-icons/ionicons';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgIconsModule } from '@ng-icons/core';
import { AppComponent } from './app.component';
import { AccountTabProfileComponent } from './components/account/account-tab-profile.component';
import { AccountTabReservationsManagementComponent } from './components/account/account-tab-reservations-management.component';
import { AccountTabRestaurantComponent } from './components/account/account-tab-restaurant.component';
import { ChatBoxComponent } from './components/chat/chat-box.component';
import { AlertComponent } from './components/common/alert.component';
import { AppSelectComponent } from './components/common/app-select.component';
import { FormInputComponent } from './components/common/form-input.component';
import { ImageStatusComponent } from './components/common/image-status.component';
import { ImageComponent } from './components/common/image.component';
import { LogoComponent } from './components/common/logo.component';
import { SnackbarComponent } from './components/common/snackbar.component';
import { UploadImageComponent } from './components/common/upload-image.component';
import { AccountDropDownComponent } from './components/header/account-drop-down.component';
import { NotificationDropDownComponent } from './components/header/notification-drop-down.component';
import { ConfirmationRestaurantRegisterComponent } from './components/restaurant-register/confirmation-restaurant-register.component';
import { FormOwnerInformationComponent } from './components/restaurant-register/form-owner-information.component';
import { FormRestaurantInformationComponent } from './components/restaurant-register/form-restaurant-information.component';
import { FormReservationComponent } from './components/restaurant/form-reservation.component';
import { MenuComponent } from './components/restaurant/menu.component';
import { RestaurantCardComponent } from './components/restaurant/restaurant-card.component';
import { RestaurantReviewComponent } from './components/restaurant/restaurant-review.component';
import { RestaurantTabOverviewComponent } from './components/restaurant/restaurant-tab-overview.component';
import { RestaurantTabReviewsComponent } from './components/restaurant/restaurant-tab-reviews.component';
import { AuthComponent } from './layouts/auth.component';
import { HeaderComponent } from './layouts/header.component';
import { AccountComponent } from './pages/account/account.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';
import { RestaurantRegisterComponent } from './pages/auth/restaurant-register.component';
import { SignInComponent } from './pages/auth/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up.component';
import { Page404Component } from './pages/error/page-404.component';
import { HomeComponent } from './pages/home/home.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { SearchComponent } from './pages/restaurant/search.component';
import { PricePipe } from './pipes/price.pipe';
import { TimePipe } from './pipes/time.pipe';
import { AddHeaderInterceptor } from './utils/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LogoComponent,
    HomeComponent,
    AlertComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent,
    AccountTabProfileComponent,
    AccountComponent,
    SnackbarComponent,
    FormInputComponent,
    AppSelectComponent,
    UploadImageComponent,
    ImageStatusComponent,
    ResetPasswordComponent,
    AccountDropDownComponent,
    FormOwnerInformationComponent,
    RestaurantRegisterComponent,
    NotificationDropDownComponent,
    FormRestaurantInformationComponent,
    AccountTabReservationsManagementComponent,
    ConfirmationRestaurantRegisterComponent,
    MenuComponent,
    RestaurantComponent,
    RestaurantCardComponent,
    RestaurantTabOverviewComponent,
    RestaurantTabReviewsComponent,
    RestaurantReviewComponent,
    ImageComponent,
    ChatBoxComponent,
    FormReservationComponent,
    ReservationComponent,
    Page404Component,
    TimePipe,
    PricePipe,
    AccountTabRestaurantComponent,
    SearchComponent,
    NotificationComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),

    // icon
    NgIconsModule.withIcons({
      ionClose,
      ionImage,
      heroClock,
      ionArrowRedo,
      ionBugOutline,
      ionCashOutline,
      heroXMarkSolid,
      ionLogInOutline,
      ionLogOutOutline,
      ionPersonOutline,
      ionPricetagOutline,
      ionWarningOutline,
      ionLocationOutline,
      heroUserCircleSolid,
      ionCloudUploadOutline,
      ionAlertCircleOutline,
      ionDocumentTextOutline,
      ionCheckmarkCircleOutline,
      ionInformationCircleOutline,
      ionChatbubbleEllipsesOutline,
    }),

    // component modules
    CarouselModule.forRoot(),
    TimepickerModule.forRoot(),
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatStepperModule, 
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
