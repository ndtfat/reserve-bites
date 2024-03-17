import { Component } from '@angular/core';

@Component({
  selector: 'auth',
  styles: [
    `
      @import '../scss/common.scss';
      @import '../scss/responsive.scss';
      .wrapper {
        width: 100vw;
        min-height: 100vh;
        padding: 30px;
        @include flex(row, center, center);
        background: url('../../assets/backgrounds/auth-layout.jpeg') no-repeat;
        background-size: cover;
        background-position: right;

        & > div {
          @include shadow;
        }
      }

      @include desktop {
      }

      @include mobile {
        .wrapper div {
          width: 100%;
        }
      }
      @include tablet {
        .wrapper div {
          width: 550px;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div>
        <!-- <logo class="logo" [text]="true" /> -->
        <router-outlet />
      </div>
    </div>
  `,
})
export class AuthComponent {
  // logoWidth?: number;
  // constructor() {
  //   const windowWidth = window.innerWidth;
  //   this.resizeLogo(windowWidth);
  // }
  // resizeLogo(width: number) {
  //   if (width < 760) this.logoWidth = 250;
  //   if (width < 460) this.logoWidth = 220;
  // }
  // @HostListener('window:resize', ['$event'])
  // resize(window: any) {
  //   const windowWidth = window.target.innerWidth;
  //   this.resizeLogo(windowWidth);
  // }
}
