import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import routes from './routes';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// icons
import { heroClock, heroTrash } from '@ng-icons/heroicons/outline';
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

// pipes
import { PricePipe } from './pipes/price.pipe';
import { TimePipe } from './pipes/time.pipe';

//components
import { AppComponent } from './app.component';
import { MenuComponent } from './components/restaurant/menu.component';
import { LogoComponent } from './components/common/logo.component';
import { AuthComponent } from './layouts/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AlertComponent } from './components/common/alert.component';
import { ImageComponent } from './components/common/image.component';
import { HeaderComponent } from './layouts/header.component';
import { SignInComponent } from './pages/auth/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up.component';
import { SearchComponent } from './pages/restaurant/search.component';
import { ChatBoxComponent } from './components/chat/chat-box.component';
import { AccountComponent } from './pages/account/account.component';
import { Page404Component } from './pages/error/page-404.component';
import { SnackbarComponent } from './components/common/snackbar.component';
import { AppSelectComponent } from './components/common/app-select.component';
import { FormInputComponent } from './components/common/form-input.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { ImageStatusComponent } from './components/common/image-status.component';
import { UploadImageComponent } from './components/common/upload-image.component';
import { AddHeaderInterceptor } from './utils/token.interceptor';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';
import { RestaurantCardComponent } from './components/restaurant/restaurant-card.component';
import { AccountDropDownComponent } from './components/header/account-drop-down.component';
import { FormReservationComponent } from './components/restaurant/form-reservation.component';
import { RestaurantReviewComponent } from './components/restaurant/restaurant-review.component';
import { AccountTabProfileComponent } from './components/account/account-tab-profile.component';
import { RestaurantRegisterComponent } from './pages/auth/restaurant-register.component';
import { NotificationDropDownComponent } from './components/header/notification-drop-down.component';
import { RestaurantTabReviewsComponent } from './components/restaurant/restaurant-tab-reviews.component';
import { FormOwnerInformationComponent } from './components/restaurant-register/form-owner-information.component';
import { AccountTabRestaurantComponent } from './components/account/account-tab-restaurant.component';
import { RestaurantTabOverviewComponent } from './components/restaurant/restaurant-tab-overview.component';
import { FormRestaurantInformationComponent } from './components/restaurant-register/form-restaurant-information.component';
import { ConfirmationRestaurantRegisterComponent } from './components/restaurant-register/confirmation-restaurant-register.component';
import { AccountTabReservationsManagementComponent } from './components/account/account-tab-reservations-management.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LogoComponent,
    MenuComponent,
    HomeComponent,
    AlertComponent,
    ImageComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent,
    SearchComponent,
    AccountComponent,
    Page404Component,
    ChatBoxComponent,
    SnackbarComponent,
    FormInputComponent,
    AppSelectComponent,
    RestaurantComponent,
    UploadImageComponent,
    ImageStatusComponent,
    ReservationComponent,
    NotificationComponent,
    ResetPasswordComponent,
    RestaurantCardComponent,
    AccountDropDownComponent,
    FormReservationComponent,
    RestaurantReviewComponent,
    AccountTabProfileComponent,
    RestaurantRegisterComponent,
    AccountTabRestaurantComponent,
    FormOwnerInformationComponent,
    NotificationDropDownComponent,
    RestaurantTabReviewsComponent,
    RestaurantTabOverviewComponent,
    FormRestaurantInformationComponent,
    ConfirmationRestaurantRegisterComponent,
    AccountTabReservationsManagementComponent,

    TimePipe,
    PricePipe,
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
      heroTrash,
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
export class AppModule {}
