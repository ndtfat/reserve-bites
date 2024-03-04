import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/types/auth.type';

@Component({
  selector: 'account',
  styles: [
    `
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      .wrapper {
        margin: 0 50px;
      }
      @include tablet {
        .wrapper {
          max-width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="user" class="wrapper">
      <mat-tab-group>
        <mat-tab label="My Profile">
          <account-tab-profile *ngIf="user" [user]="user" />
        </mat-tab>
        <mat-tab *ngIf="user.isOwner" label="My Restaurant">
          <account-tab-restaurant />
        </mat-tab>
        <mat-tab
          *ngIf="user"
          [label]="user.isOwner ? 'Reservations Management' : 'Dining History'"
        >
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
