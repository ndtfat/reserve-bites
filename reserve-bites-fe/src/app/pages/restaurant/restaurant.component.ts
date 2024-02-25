import { format } from 'date-fns';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IRestaurant } from 'src/app/types/restaurant.type';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'restaurant',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      @import '../../scss/responsive.scss';
      img {
        @include img-fit(100%, 300px);
      }
      .body {
        @include flex(row, flex-start, flex-start);
        gap: 10px;
        margin: 0 30px;
        transform: translateY(-50px);
      }
      .info {
        @include shadow;
        background: #fff;
        border-radius: 4px;
        flex: 1;
        padding: 10px 20px;
      }
      .reservation {
        width: 34%;
      }

      @include desktop {
        .body {
          width: $body-width;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="restaurant">
      <img [src]="restaurant.mainImage.url" [alt]="restaurant.mainImage.name" />
      <div class="body">
        <div class="info">
          <mat-tab-group>
            <mat-tab label="Overview">
              <restaurant-tab-overview [restaurant]="restaurant" />
            </mat-tab>
            <mat-tab label="Reviews">
              <restaurant-tab-reviews />
            </mat-tab>
          </mat-tab-group>
        </div>

        <form-reservation class="reservation" [restaurant]="restaurant" [rid]="rid"/>
      </div>
    </div>
  `,
})
export class RestaurantComponent {
  restaurant!: IRestaurant
  fetching = true;
  rid!: string

  constructor(private route: ActivatedRoute, private restaurantSv: RestaurantService, private router: Router) {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = route.snapshot.paramMap.get('id');
      if (id) {
        this.rid = id
        this.fetching = true;
        this.restaurantSv.getRestaurant(id).subscribe((response) => {
          this.restaurant = response;
          this.fetching = false;
        }, (error) => {
          this.router.navigateByUrl('/404')
        });
      }
    }
  }


}
