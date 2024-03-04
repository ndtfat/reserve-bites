import { Component } from '@angular/core';

@Component({
  selector: 'page-404',
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        width: 100vw;
        height: 100vh;
        @include flex(row, center, center);

        & > div {
          @include flex(column, center, center);
        }
      }
      .error-code {
        position: relative;
        margin: 20px 0 100px;
        @include flex(row, center, center);
        p {
          position: absolute;
          z-index: 1;
          font-size: 250px;
          font-weight: bold;
          line-height: 200px;
          transform: skew(-2deg, -10deg);
        }
        p:first-child {
          left: -90px;
        }
        p:last-child {
          right: -90px;
        }
        img {
          transform: translateY(20px) skew(-2deg, -10deg);
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div>
        <h1 style="font-weight: bolder; margin-bottom: 16px;">OOPS</h1>
        <h4>Page not found ＞﹏＜</h4>
        <div class="error-code">
          <p>4</p>
          <img src="../../../assets/imgs/egg.png" />
          <p>4</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/">
          Back to home
        </button>
      </div>
    </div>
  `,
})
export class Page404Component {}
