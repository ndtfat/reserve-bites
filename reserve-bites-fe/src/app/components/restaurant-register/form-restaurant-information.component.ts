import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { IFormRestaurantInformationType, IRestaurant } from 'src/app/types/restaurant.type';

@Component({
  selector: 'form-restaurant-information',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/responsive.scss';
      h4 {
        font-size: 20px;
        font-weight: bold;
        margin-top: 16px;
        margin-bottom: 20px;
      }
      .button-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        button:first-child { margin-right: 20px; }
      }
      .address-group {
        width: 100%;
        @include flex(row, center, space-between);
        gap: 10px;
        & > * {
          flex: 1;
          width: 100%;
        }
      }
      .menu {
        .category {
          display: flex;
          gap: 10px;
        }
        .dish {
          width: 100%;
          display: flex;
          gap: 10px;
          & > *:not(& button) { flex: 2; }
        }
      }
      .operation-time span{ margin-right: 10px; }
      .time-pickers {
        width: 100%;
        margin-bottom: 20px;
        &, & > div { @include flex(row, center, flex-start); }
      }
      @include mobile {
        .address-group {
          @include flex(column, flex-start, flex-start);
          gap: 0;
        }
      }
    `,
  ],
  template: `
    <form [formGroup]="form">
      <h4>Restaurant Information</h4>
      <form-input
        [formGroup]="form"
        name="name"
        label="Restaurant name"
        [errors]="form.controls['name'].errors"
      />
      <form-input
        textarea
        [formGroup]="form"
        name="description"
        label="Restaurant description"
        [errors]="form.controls['description'].errors"
      />

      <!-- Address -->
      <h4>Address</h4>
      <div class="address-group">
        <form-input
          [formGroup]="addressGroup"
          name="country"
          label="Country"
          [errors]="form.get('address.country')?.errors"
        />
        <form-input
          [formGroup]="addressGroup"
          name="province"
          label="Province"
          [errors]="form.get('address.province')?.errors"
        />
        <form-input
          [formGroup]="addressGroup"
          name="detail"
          label="Address"
          [errors]="form.get('address.detail')?.errors"
        />
      </div>

      <!-- Currency -->
      <h4>Please select default currency</h4>
      <app-select
        [formGroup]="form"
        name="currency"
        label="Currency"
        [options]="[
          { value: 'USD ($)', content: 'USD ($)' },
          { value: 'EUR (€)', content: 'EUR (€)' },
          { value: 'Yen (¥)', content: 'Yen (¥)' },
          { value: 'VND', content: 'VND' }
        ]"
        [errors]="operationTimeGroup.get('currency')?.errors"
      />

      <!-- Menu -->
      <h4>
        Menu
        <span style="color:red; font-weight: lighter;">
          (Must have at least 1 category)
        </span>
      </h4>
      <div formArrayName="menu" class="menu">
        <div *ngFor="let cat of getMenuFormGroups(); let catId = index">
          <div [formGroup]="cat" class="category">
            <form-input
              style="min-width: 212px"
              [formGroup]="cat"
              name="category"
              label="Category"
              placeholder="Main dish, Appetizer,..."
              [errors]="form.get('address.detail')?.errors"
            />
            <div
              formArrayName="dishes"
              style="flex: 1; display: flex; flex-direction: column; align-items: flex-end;margin-bottom: 20px"
            >
              <div
                *ngFor="
                  let dish of getDishesFormGroups(cat);
                  let dishId = index
                "
                class="dish"
              >
                <form-input
                  [formGroup]="dish"
                  name="name"
                  label="Name of dish"
                  [errors]="form.get('address.detail')?.errors"
                />
                <form-input
                  [formGroup]="dish"
                  type="number"
                  name="price"
                  label="Price"
                  [errors]="form.get('address.detail')?.errors"
                >
                  {{ form.get('currency')?.value }}
                </form-input>
                <button
                  mat-icon-button
                  type="button"
                  style="width: 50px;"
                  (click)="handleRemoveDish(catId, dishId)"
                >
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <button
                mat-raised-button
                type="button"
                style="margin-right: 58px"
                (click)="handleAddDish(cat)"
              >
                Add dish
              </button>
            </div>
          </div>
        </div>
        <button
          mat-raised-button
          type="button"
          color="primary"
          style="min-width: 212px"
          (click)="handleAddCategory()"
        >
          Add category
        </button>
      </div>

      <!-- Operation time -->
      <!-- <div style="margin-top: 30px;"></div> -->
      <h4>Operation time</h4>
      <div class="operation-time">
        <div [formGroup]="operationTimeGroup" class="time-pickers">
          <div style="margin-right: 50px;">
            <span>Open time:</span>
            <timepicker
              formControlName="openTime"
              [hourStep]="1"
              [minuteStep]="1"
              [showMeridian]="false"
            />
          </div>
          <div>
            <span>Close time:</span>
            <timepicker
              formControlName="closeTime"
              [hourStep]="1"
              [minuteStep]="1"
              [showMeridian]="false"
            />
          </div>
        </div>
        <app-select
          multiple
          [options]="dayOptions"
          [formGroup]="operationTimeGroup"
          name="openDay"
          label="Open day(s)"
          [errors]="operationTimeGroup.get('openDay')?.errors"
        />
      </div>

      <form-input
        [formGroup]="form"
        name="maxReservationSize"
        label="Max reservation size"
        type="number"
        [errors]="form.get('maxReservationSize')?.errors"
      />

      <!-- Main image -->
      <h4>
        Main image
        <span style="color:red; font-weight: normal;">(Restaurant must have main image)</span>
      </h4>
      <upload-image
        *ngIf="!form.get('mainImage')?.value"
        (onUploadFile)="handleUPloadMainImage($event)"
      />
      <image-status
        *ngIf="form.get('mainImage')?.value"
        [error]="form.get('mainImage')?.value?.error"
        [file]="form.get('mainImage')?.value.file"
        [progress]="form.get('mainImage')?.value.progress"
        (onDelete)="handleDeleteMainImage()"
      />

      <!-- Gallery -->
      <h4>Gallery</h4>
      <upload-image multiple (onUploadFiles)="handleUploadGallery($event)" />
      <div style="margin-top: 20px;"></div>
      <div *ngFor="let item of form.get('gallery')?.value" style="margin-bottom: 16px;">
        <image-status
          [error]="item?.error"
          [file]="item.file"
          [progress]="item.progress"
          (onDelete)="handleDeleteItemInGallery(item.file)"
        />
      </div>

      <!-- Buttons -->
      <div class="button-wrapper">
        <button *ngIf="backButton" type="button" mat-raised-button (click)="back.emit()">
          Back
        </button>
        <button type="button" mat-raised-button color="main" [disabled]="loading" (click)="handleSubmit()">
          {{submitButtonName}}
        </button>
      </div>
    </form>
  `,
})
export class FormRestaurantInformationComponent implements OnInit {
  @Input() loading = false;
  @Input() backButton: boolean = true;
  @Input() submitButtonName: string = 'submit';
  @Input() restaurantInfo?: IRestaurant;
  @Output() back = new EventEmitter();
  @Output() submit = new EventEmitter<IFormRestaurantInformationType & { deletedImageIds?: string[] }>();

  deletedImageIds: string[] = [];
  dayOptions = ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
    return { value: day.substring(0, 3), content: day };
  });

  addressGroup: FormGroup = this.fb.group({
    country: ['', Validators.required],
    province: ['', Validators.required],
    detail: ['', Validators.required],
  });
  menuArray: FormArray = this.fb.array([
    this.fb.group({
      category: ['', Validators.required],
      dishes: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          price: ['', Validators.required],
        }),
      ]),
    }),
  ]);
  operationTimeGroup: FormGroup = this.fb.group({
    openTime: [new Date(), Validators.required],
    closeTime: [new Date(), Validators.required],
    openDay: [[], Validators.required],
  });

  initialMainImage: any = null;
  initialGallery: any = [];
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    address: this.addressGroup,
    currency: ['VND', Validators.required],
    menu: this.menuArray,
    operationTime: this.operationTimeGroup,
    maxReservationSize: [1, [Validators.required, Validators.min(1)]],
    mainImage: [this.initialMainImage, Validators.required],
    gallery: [this.initialGallery],
  });

  constructor(private fb: FormBuilder, private imageSv: ImageService) { }

  ngOnInit() {
    if (this.restaurantInfo) {
      this.addressGroup.patchValue({
        country: this.restaurantInfo.address.country,
        province: this.restaurantInfo.address.province,
        detail: this.restaurantInfo.address.detail,
      });

      this.menuArray.clear();
      this.restaurantInfo.menu.map((category) =>
        this.menuArray.push(this.fb.group({
          category: category.category,
          dishes: this.fb.array(
            category.dishes.map((dish) =>
              this.fb.group({
                name: dish.name,
                price: dish.price,
              })
            )
          ),
        }))
      )

      this.form.patchValue({
        name: this.restaurantInfo.name,
        description: this.restaurantInfo.description,
        address: this.addressGroup,
        currency: this.restaurantInfo.currency,
        // ... (patch other fields accordingly)

        // For arrays, you can iterate and patch values
        menu: this.menuArray.value,

        operationTime: {
          openTime: this.restaurantInfo.operationTime.openTime,
          closeTime: this.restaurantInfo.operationTime.closeTime,
        },
        maxReservationSize: this.restaurantInfo.maxReservationSize,
        mainImage: { file: this.restaurantInfo.mainImage, progress: 100 },
        gallery: this.restaurantInfo.gallery.map(item => {
          return { file: item, progress: 100 }
        }),
      });
    }
  }

  // menu methods
  getMenuFormGroups() {
    return (this.form.get('menu') as FormArray).controls as FormGroup[];
  }
  getDishesFormGroups(cat: FormGroup) {
    return (cat.get('dishes') as FormArray).controls as FormGroup[];
  }
  handleAddCategory() {
    this.form.controls.menu.push(
      this.fb.group({
        category: ['', Validators.required],
        dishes: this.fb.array([
          this.fb.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
          }),
        ]),
      })
    );
  }
  handleAddDish(category: FormGroup) {
    (category.controls['dishes'] as FormArray).push(
      this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
      })
    );
  }
  handleRemoveDish(categoryId: number, dishId: number) {
    const categoruControl = this.form.controls.menu.at(categoryId);
    const dishesControl = categoruControl.get('dishes') as FormArray;
    // flag tell delete category when just remain 1 dish in category
    const isDeleteCategory = dishesControl.length === 1;
    // allow delete category when menu have more than 1 category
    const enableDeleteCategory = this.form.controls.menu.length > 1;

    if (dishesControl.length === 1 && !enableDeleteCategory) return;
    dishesControl.removeAt(dishId);
    if (isDeleteCategory) this.form.controls.menu.removeAt(categoryId);
  }

  // image methods
  handleUPloadMainImage(file: File) {
    const mainImageControl = this.form.controls.mainImage;
    mainImageControl.setValue({ progress: 0, file });
    this.imageSv.uploadSingle(file).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if (event.total)
            mainImageControl.setValue({
              progress: Math.round((event.loaded / event.total) * 100) - 10,
              file,
            });
          break;
        case HttpEventType.Response:
          mainImageControl.setValue({
            progress: 100,
            file: event.body,
          });
          break;
      }
    },
      (error) => {
        console.log(error)
        mainImageControl.setValue({
          progress: 100,
          file,
          error,
        });
      });
  }

  handleUploadGallery(files: File[]) {
    const gallery = this.form.controls.gallery;
    const formatedFiles = files.map((file) => {
      return { file, progress: 0 };
    });
    gallery.setValue([...formatedFiles, ...gallery.value]);

    for (let item of gallery.value) {
      if (item.file.type.includes('image')) {
        this.imageSv
          .uploadSingle(item.file)
          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                gallery.setValue(
                  gallery.value.map((el: any) => {
                    if (el.file.name === item.file.name && event.total) {
                      el.progress =
                        Math.round((event.loaded / event.total) * 100) - 10;
                    }
                    return { ...el };
                  })
                );
                break;
              case HttpEventType.Response:
                gallery.setValue(
                  gallery.value.map((el: any) => {
                    if (el.file.name === item.file.name) {
                      el.progress = 100;
                      el.file = event.body;
                    }
                    return { ...el };
                  })
                );
            }
          },
            (error) => {
              console.log(error)
              gallery.value.map((el: any) => {
                if (el.file.name === item.file.name) {
                  el.progress = 100;
                  el.file = item.file;
                  el.error = error;
                }
                return { ...el };
              })
            });
      }
    }
  }
  handleDeleteMainImage() {
    this.deletedImageIds.push(this.form.controls.mainImage.value.file.id);
    this.form.controls.mainImage.setValue(null);
  }
  handleDeleteItemInGallery(deletedFile: any) {
    const gallery = this.form.controls.gallery;
    const newGalleryValue = gallery.value.filter(
      (item: any) => item.file.name !== deletedFile.name
    );
    this.deletedImageIds.push(deletedFile.id);
    gallery.setValue(newGalleryValue);
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      const values = { ...this.form.value };
      // format images
      values.mainImage = values.mainImage.file;
      if (values.gallery) {
        values.gallery = values.gallery.map((item: any) => item.file);
      }
      this.submit.emit({
        ...(values as IFormRestaurantInformationType),
        ...(this.restaurantInfo ? { deletedImageIds: this.deletedImageIds } : {})
      });
    }
  }
}
