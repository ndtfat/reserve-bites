/// <reference types="@angular/localize" />

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import routes from './app/routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddHeaderInterceptor } from './app/utils/token.interceptor';
import { NgIconsModule } from '@ng-icons/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      MatNativeDateModule,
      BrowserAnimationsModule,
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
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    },
  ],
}).catch((error) => console.log(error));
