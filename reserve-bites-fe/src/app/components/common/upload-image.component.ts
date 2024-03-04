import {
  Input,
  Output,
  Component,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'upload-image',
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        @include flex(column, center, center);
        border: 1px dashed #ccc;
        padding: 32px 0;
        cursor: pointer;
        & > * {
          font-weight: normal;
        }
        .sub-text {
          margin-top: 6px;
          color: #aaa;
        }
      }
      .wrapper.error {
        background-color: #fbe9e8;
        .sub-text {
          color: red;
        }
      }
    `,
  ],
  template: `
    <label class="wrapper" [ngClass]="{ error: errorMessage }">
      <div style="margin-bottom: 10px;">
        <ng-icon
          *ngIf="errorMessage"
          name="ionBugOutline"
          size="50"
          color="red"
        />
        <ng-icon
          *ngIf="!errorMessage"
          name="ionDocumentTextOutline"
          size="50"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        style="display: none;"
        [multiple]="multiple"
        (input)="hadnleUploadImage($event)"
      />
      <h4>Click to <span style="color: blue">upload</span></h4>
      <p class="sub-text">
        {{ errorMessage || 'SVG, PNG, JPG or GIF (max. 1MB)' }}
      </p>
    </label>
  `,
})
export class UploadImageComponent {
  @Input({ transform: booleanAttribute }) multiple = false;
  @Output() onUploadFile = new EventEmitter<File>();
  @Output() onUploadFiles = new EventEmitter<File[]>();

  errorMessage = '';

  hadnleUploadImage(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && !this.multiple) {
      const file = files[0];
      if (!file.type.includes('image')) {
        this.errorMessage = 'Unsuported file (Must be image file)';
      } else if (file.size > 1024 * 1024 * 3) {
        this.errorMessage = 'File too large (Max. 1MB)';
      } else {
        this.onUploadFile.emit(file);
      }
    } else if (files && this.multiple) {
      this.onUploadFiles.emit(Array.from(files));
    }
  }
}
