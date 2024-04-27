import { Component, EventEmitter, Output } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';

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
    <form [formGroup]="form">
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
      <upload-image *ngIf="!form.get('poster')?.value" (onUploadFile)="handleUploadImg($event)" />
      <image-status
        *ngIf="form.get('poster')?.value"
        [error]="form.get('poster')?.value?.error"
        [file]="form.get('poster')?.value.file"
        [progress]="form.get('poster')?.value.progress"
        (onDelete)="handleDeletePoster()"
      />

      <div style="margin-top: 20px;"></div>
      <div style="text-align: right;">
        <button mat-raised-button color="black" type="button" (click)="handleSubmit()">
          Create
        </button>
      </div>
    </form>
  `,
})
export class FormCreateEventComponent {
  @Output() submit = new EventEmitter();

  constructor(private fb: FormBuilder, private imageSv: ImageService, private auth: AuthService) {}

  minDate = new Date(new Date().setUTCDate(new Date().getUTCDate() + 1));
  initialPoster: any = null;
  deletedImageIds: string[] = [];
  form = this.fb.group({
    name: ['', Validators.required],
    poster: [this.initialPoster, Validators.min(1)],
    endDate: [new Date(this.minDate), Validators.required],
    description: ['', Validators.required],
  });

  handleUploadImg(file: File) {
    const mainImageControl = this.form.controls.poster;
    mainImageControl.setValue({ progress: 0, file });
    this.imageSv.uploadSingle(file).subscribe(
      (event: HttpEvent<any>) => {
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
        console.log(error);
        mainImageControl.setValue({
          progress: 100,
          file,
          error,
        });
      },
    );
  }

  handleDeletePoster() {
    this.form.controls.poster.setValue(null);
  }

  handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid && this.auth.user.value?.rid) {
      const formValue = this.form.value;
      const payload = {
        rid: this.auth.user.value.rid,
        name: formValue.name || '',
        poster: formValue.poster.file.id,
        desc: formValue.description || '',
        endDate: formValue.endDate as Date,
      };
      this.submit.emit(payload);
    }
  }
}
