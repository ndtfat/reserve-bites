import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'home-section-owner',
  standalone: true,
  imports: [MatButtonModule],
  styles: [
    `
      @import '../../../../scss/common.scss';
      @import '../../../../scss/variables.scss';
      @import '../../../../scss/responsive.scss';
      $left-side-width: 40%;
      $right-side-width: 60%;

      .background {
        width: $left-side-width;
        height: 100%;
        background: url('../../../../../assets/backgrounds/home-owner.png') no-repeat 0% 60%;
        background-size: cover;
        background-position: center;
      }

      .right-side {
        width: $right-side-width;
        height: 100%;
        border: 1px solid #ccc;
        padding: 20px 30px;
      }

      .sub-text {
        color: $sub-text-color;
        margin: 6px 0 16px;
        @include ellipsis(2);
      }
    `,
  ],
  template: `
    <h4 style="font-weight: 600; margin-bottom: 20px;">Are you a restaurant owner?</h4>
    <div style="width: 100%; height: 300px; display: flex; background: #fff;">
      <div class="background"></div>
      <div class="right-side">
        <div>
          <h5>Register your restaurant</h5>
          <p class="sub-text">
            Fill nessesary informmation about your restaurant to register restaurant. And create
            events to attract more client to visit your restaurant.
          </p>
          <button mat-raised-button>Register now</button>
        </div>

        <div style="margin-top: 30px">
          <h5>Already a client</h5>
          <p class="sub-text">Login and manage your restaurant</p>
          <button mat-raised-button>Log in now</button>
        </div>
      </div>
    </div>
  `,
})
export class HomeSectionOwnerComponent {}
