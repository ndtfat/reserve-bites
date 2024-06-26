import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
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
      <mat-tab-group [style]="{ width: '100%' }" (selectedTabChange)="handleTabChange($event)">
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
export class AccountComponent implements AfterViewInit {
  user!: IUser;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = route.snapshot.paramMap.get('id');
      if (id === 'me') {
        this.auth.user.subscribe((userInfo) => (this.user = userInfo as IUser));
      }
    }
  }

  ngAfterViewInit() {
    if (this.route.snapshot.paramMap.has('tab')) {
      this.tabGroup.selectedIndex = Number(this.route.snapshot.paramMap.get('tab'));
    }
  }

  handleTabChange(event: MatTabChangeEvent) {
    this.tabGroup.selectedIndex = event.index;
    this.router.navigateByUrl(`/account/${this.route.snapshot.paramMap.get('id')}/${event.index}`);
  }
}
