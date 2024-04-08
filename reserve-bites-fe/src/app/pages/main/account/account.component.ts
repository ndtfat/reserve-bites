import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { AccountTabProfileComponent } from 'src/app/pages/components/tabs/account-tab-profile.component';
import { AccountTabReservationsManagementComponent } from 'src/app/pages/components/tabs/account-tab-reservations-management.component';
import { AccountTabRestaurantComponent } from 'src/app/pages/components/tabs/account-tab-restaurant.component';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/types/auth.type';

@Component({
  selector: 'account',
  standalone: true,
  imports: [
    NgIf,
    MatTabsModule,
    AccountTabProfileComponent,
    AccountTabRestaurantComponent,
    AccountTabReservationsManagementComponent,
  ],
  styles: [
    `
      @import '../../../scss/variables.scss';
      @import '../../../scss/responsive.scss';
      .wrapper {
        width: min($body-width, 80vw);
      }
      @include tablet {
        .wrapper {
          // max-width: $body-width;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="user" class="wrapper">
      <mat-tab-group [style]="{ width: '100%' }">
        <mat-tab label="My Profile">
          <account-tab-profile *ngIf="user" [user]="user" />
        </mat-tab>
        <mat-tab *ngIf="user.isOwner" label="My Restaurant">
          <account-tab-restaurant />
        </mat-tab>
        <mat-tab *ngIf="user" [label]="user.isOwner ? 'Reservations Management' : 'Dining History'">
          <account-tab-reservations-management />
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  user!: IUser;

  constructor(private route: ActivatedRoute, private auth: AuthService) {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = route.snapshot.paramMap.get('id');
      if (id === 'me') {
        this.auth.user.subscribe((userInfo) => (this.user = userInfo as IUser));
      }
    }
  }

  ngOnInit() {}
}
