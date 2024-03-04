import {
  Input,
  Output,
  Component,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import validationMessages, {
  ValidationMessages,
} from '../../utils/validationMessages';

@Component({
  selector: 'form-input',
  styles: [
    `
      .suffix-content:not(:empty) {
        padding: 0 10px;
        border-left: 1px solid #ccc;
      }
    `,
  ],
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field
        [appearance]="appearance"
        style="width: 100%;"
        [style]="style"
      >
        <mat-label *ngIf="label">{{ label }}</mat-label>
        <input
          [min]="min"
          [max]="max"
          *ngIf="!textarea"
          matInput
          (blur)="onBlur()"
          [placeholder]="placeholder"
          (change)="onValueChange($event)"
          [type]="type"
          [formControlName]="name || 'name'"
        />
        <textarea
          *ngIf="textarea"
          matInput
          rows="3"
          (blur)="onBlur()"
          [placeholder]="placeholder"
          (change)="onValueChange($event)"
          [type]="type"
          [formControlName]="name || 'name'"
        ></textarea>
        <button
          *ngIf="icon"
          matSuffix
          mat-icon-button
          type="button"
          (click)="handleClickIcon()"
        >
          <mat-icon>{{ icon }}</mat-icon>
        </button>

        <span matSuffix class="suffix-content"><ng-content /></span>
        <mat-error *ngIf="errors && !!errorMessage">
          {{ errorMessage }}
        </mat-error>
      </mat-form-field>
    </div>
  `,
})
export class FormInputComponent {
  @Input({ transform: booleanAttribute }) textarea = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() icon?: string;
  @Input() style = {};
  @Input() type: string = 'text';
  @Input() min: number = 0;
  @Input() max: number = 5;
  @Input() formGroup: FormGroup = new FormGroup({ name: new FormControl('') });
  @Input() name: string = '';
  @Input() errors?: any;
  @Input() onValueChange: (event: Event) => any = () => {};
  @Output() onClickIcon = new EventEmitter();

  errorMessage: string = '';

  constructor() {}
  onBlur() {
    for (let key in this.errors) {
      this.errorMessage = validationMessages[key as keyof ValidationMessages];
      break;
    }
  }

  handleClickIcon() {
    this.onClickIcon.emit();
  }
}
