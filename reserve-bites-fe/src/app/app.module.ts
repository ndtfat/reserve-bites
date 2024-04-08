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
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import {
  matStarOutline,
  matCloseOutline,
  matCancelOutline,
  matModeEditOutline,
  matMoreHorizOutline,
  matOpenInNewOutline,
  matMarkEmailReadOutline,
  matAccountCircleOutline,
  matNotificationsNoneOutline,
} from '@ng-icons/material-icons/outline';
import {
  heroClock,
  heroTrash,
  heroPencil,
  heroTicket,
  heroFaceFrown,
  heroFaceSmile,
  heroPencilSquare,
  heroChatBubbleBottomCenterText,
} from '@ng-icons/heroicons/outline';
import { heroUserCircleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';
import {
  ionClose,
  ionImage,
  ionArrowRedo,
  ionBugOutline,
  ionCashOutline,
  ionLogInOutline,
  ionLogOutOutline,
  ionPersonOutline,
  ionWarningOutline,
  ionLocationOutline,
  ionPricetagOutline,
  ionSettingsOutline,
  ionLockClosedOutline,
  ionCloudUploadOutline,
  ionAlertCircleOutline,
  ionChatbubblesOutline,
  ionDocumentTextOutline,
  ionCheckmarkCircleOutline,
  ionInformationCircleOutline,
  ionChatbubbleEllipsesOutline,
} from '@ng-icons/ionicons';

// pipes
import { PricePipe } from './pipes/price.pipe';
import { TimePipe } from './pipes/time.pipe';

//components
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/main/restaurant/components/menu.component';
import { LogoComponent } from './components/common/logo.component';
import { AuthComponent } from './layouts/auth.component';
import { HomeComponent } from './pages/main/home/home.component';
import { AlertComponent } from './components/common/alert.component';
import { ImageComponent } from './components/common/image.component';
import { HeaderComponent } from './layouts/header.component';
import { SignInComponent } from './pages/auth/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up.component';
import { SearchComponent } from './pages/main/restaurant/search.component';
import { ChatBoxComponent } from './components/chat/chat-box.component';
import { AccountComponent } from './pages/main/account/account.component';
import { Page404Component } from './pages/error/page-404.component';
import { SnackbarComponent } from './components/common/snackbar.component';
import { AppSelectComponent } from './components/common/app-select.component';
import { FormInputComponent } from './components/common/form-input.component';
import { RestaurantComponent } from './pages/main/restaurant/restaurant.component';
import { ImageStatusComponent } from './components/common/image-status.component';
import { UploadImageComponent } from './components/common/upload-image.component';
import { AddHeaderInterceptor } from './utils/token.interceptor';
import { ReservationComponent } from './pages/main/reservation/reservation.component';
import { NotificationComponent } from './pages/main/notification/notification.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';
import { RestaurantCardComponent } from './pages/main/restaurant/components/restaurant-card.component';
import { AccountDropDownComponent } from './components/header/account-drop-down.component';
import { FormReservationComponent } from './pages/components/forms/form-reservation.component';
import { RestaurantReviewComponent } from './pages/main/restaurant/components/restaurant-review.component';
import { AccountTabProfileComponent } from './pages/components/tabs/account-tab-profile.component';
import { RestaurantRegisterComponent } from './pages/auth/restaurant-register.component';
import { NotificationDropDownComponent } from './components/header/notification-drop-down.component';
import { RestaurantTabReviewsComponent } from './pages/components/tabs/restaurant-tab-reviews.component';
import { FormOwnerInformationComponent } from './pages/components/forms/form-owner-information.component';
import { AccountTabRestaurantComponent } from './pages/components/tabs/account-tab-restaurant.component';
import { RestaurantTabOverviewComponent } from './pages/components/tabs/restaurant-tab-overview.component';
import { FormRestaurantInformationComponent } from './pages/components/forms/form-restaurant-information.component';
import { ConfirmationRestaurantRegisterComponent } from './pages/auth/components/confirmation-restaurant-register.component';
import { AccountTabReservationsManagementComponent } from './pages/components/tabs/account-tab-reservations-management.component';

@NgModule({
  declarations: [],
  imports: [
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
      heroPencil,
      heroTicket,
      ionArrowRedo,
      ionBugOutline,
      heroFaceFrown,
      heroFaceSmile,
      ionCashOutline,
      matStarOutline,
      heroXMarkSolid,
      matCloseOutline,
      ionLogInOutline,
      ionLogOutOutline,
      ionPersonOutline,
      matCancelOutline,
      heroPencilSquare,
      ionWarningOutline,
      matModeEditOutline,
      ionPricetagOutline,
      ionSettingsOutline,
      ionLocationOutline,
      matOpenInNewOutline,
      heroUserCircleSolid,
      matMoreHorizOutline,
      ionLockClosedOutline,
      ionCloudUploadOutline,
      ionAlertCircleOutline,
      ionChatbubblesOutline,
      ionDocumentTextOutline,
      matMarkEmailReadOutline,
      matAccountCircleOutline,
      ionCheckmarkCircleOutline,
      matNotificationsNoneOutline,
      ionInformationCircleOutline,
      ionChatbubbleEllipsesOutline,
      heroChatBubbleBottomCenterText,
    }),

    // component modules
    PopoverModule.forRoot(),
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
    MatTooltipModule,
    MatStepperModule,
    MatCheckboxModule,
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
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
})
export class AppModule {}
