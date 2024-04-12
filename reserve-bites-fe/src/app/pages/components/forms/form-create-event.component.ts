import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from 'src/app/components/common/form-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UploadImageComponent } from 'src/app/components/common/upload-image.component';
import { ImageStatusComponent } from 'src/app/components/common/image-status.component';
import { ImageService } from 'src/app/services/image.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'form-create-event',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    FormInputComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    UploadImageComponent,
    ImageStatusComponent,
  ],
  styles: [],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <form-input
        [formGroup]="form"
        name="name"
        label="Event name"
        [errors]="form.get('name')?.errors"
      />
      <form-input
        textarea
        [formGroup]="form"
        name="description"
        label="Event description"
        [errors]="form.get('description')?.errors"
      />
      <mat-form-field style="width: 100%" appearance="outline">
        <mat-label>End date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="endDate" [min]="minDate" />
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-datepicker #picker />
      </mat-form-field>

      <h4 style="margin-bottom: 14px;">Event images</h4>
      <upload-image multiple (onUploadFiles)="handleUploadImg($event)" />
      <div style="margin-top: 20px;"></div>
      <div *ngFor="let item of form.get('imgs')?.value" style="margin-bottom: 16px;">
        <image-status
          [error]="item?.error"
          [file]="item.file"
          [progress]="item.progress"
          (onDelete)="handleDeleteImg(item.file)"
        />
      </div>

      <div style="text-align: right;">
        <button mat-raised-button color="primary">Create</button>
      </div>
    </form>
  `,
})
export class FormCreateEventComponent {
  constructor(
    private fb: FormBuilder,
    private imageSv: ImageService,
    private restaurantSv: RestaurantService,
  ) {}

  minDate = new Date(new Date().setUTCDate(new Date().getUTCDate() + 1));
  initialImgs: any = [];
  deletedImageIds: string[] = [];
  form = this.fb.group({
    name: ['', Validators.required],
    imgs: [this.initialImgs, Validators.min(1)],
    endDate: [new Date(this.minDate), Validators.required],
    description: ['', Validators.required],
  });

  handleUploadImg(files: File[]) {
    console.log(files);

    const imgs = this.form.controls.imgs;
    const formatedFiles = files.map((file) => {
      return { file, progress: 0 };
    });
    imgs.setValue([...formatedFiles, ...imgs.value]);

    for (let item of imgs.value) {
      if (item.file.type.includes('image')) {
        this.imageSv.uploadSingle(item.file).subscribe(
          (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                imgs.setValue(
                  imgs.value.map((el: any) => {
                    if (el.file.name === item.file.name && event.total) {
                      el.progress = Math.round((event.loaded / event.total) * 100) - 10;
                    }
                    return { ...el };
                  }),
                );
                break;
              case HttpEventType.Response:
                imgs.setValue(
                  imgs.value.map((el: any) => {
                    if (el.file.name === item.file.name) {
                      el.progress = 100;
                      el.file = event.body;
                    }
                    return { ...el };
                  }),
                );
            }
          },
          (error) => {
            imgs.value.map((el: any) => {
              if (el.file.name === item.file.name) {
                el.progress = 100;
                el.file = item.file;
                el.error = error;
              }
              return { ...el };
            });
          },
        );
      }
    }
  }

  handleDeleteImg(deletedFile: any) {
    const imgs = this.form.controls.imgs;
    const newimgsValue = imgs.value.filter((item: any) => item.file.name !== deletedFile.name);
    this.deletedImageIds.push(deletedFile.id);
    imgs.setValue(newimgsValue);
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      this.restaurantSv.createEvent();
    }
  }
}
