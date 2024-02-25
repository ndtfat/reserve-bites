import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { IReview } from 'src/app/types/restaurant.type';

@Component({
  selector: 'restaurant-tab-reviews',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .wrapper {
        padding: 20px 0 10px;
      }
      h2 {
        font-weight: 600;
        margin-bottom: 20px;
      }
      h6 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      .review-box {
        position: relative;
        padding: 20px;
        margin-bottom: 30px;
        border: 20px solid $primary--blur;
        .point {
          display: flex;
          gap: 20px;
          & > * {
            flex: 1;
          }
        }
        .overlay {
          position: absolute;
          inset: 0;
          filter: blur(0.5);
          font-size: 20px;
          font-weight: bold;
          @include flex(row, center, center);
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 1;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <h2>Reviews</h2>
      <h6>What are your feeling about this restaurant?</h6>
      <form class="review-box" (ngSubmit)="handlePostReview()">
        <div [formGroup]="form" class="point">
          <form-input
            label="Food"
            type="number"
            name="food"
            [formGroup]="form"
            [errors]="form.controls['food'].errors"
          />
          <form-input
            label="Service"
            type="number"
            name="service"
            [formGroup]="form"
            [errors]="form.controls['service'].errors"
          />
          <form-input
            label="Ambiance"
            type="number"
            name="ambiance"
            [formGroup]="form"
            [errors]="form.controls['ambiance'].errors"
          />
        </div>
        <form-input
          textarea
          label="Your review"
          name="content"
          [formGroup]="form"
          [errors]="form.controls['content'].errors"
        />
        <div style="display: flex; justify-content: flex-end;">
          <button mat-raised-button color="primary" type="sub">Post</button>
        </div>

        <!-- <div class="overlay">Reviews can only be made by diners who have eaten at this restaurant</div> -->
      </form>

      <div
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <h6>What other diners said about this restaurant:</h6>
        <select style="margin-bottom: 20px">
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
      <restaurant-review />
      <mat-divider style="margin:20px 10px;" />
      <restaurant-review />
      <mat-divider style="margin:20px 10px;" />
      <restaurant-review />
      <mat-divider style="margin:20px 10px;" />
    </div>
  `,
})
export class RestaurantTabReviewsComponent {
  constructor(
    private fb: FormBuilder,
    private restaurantSv: RestaurantService,
    private auth: AuthService
  ) { }
  @Input() rid!: string;
  userReview: IReview | null = null;

  form = this.fb.group({
    food: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    service: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    ambiance: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    content: ['', Validators.required],
  });
  async handlePostReview() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      const values = this.form.value;
      const payload = {
        rid: this.rid,
        dinerId: this.auth.user.value?.id as string,
        food: values.food as number,
        service: values.service as number,
        ambiance: values.ambiance as number,
        content: values.content as string,
      };
      const respsonse = await this.restaurantSv.review(payload);
      console.log(respsonse);
    }
  }
}
