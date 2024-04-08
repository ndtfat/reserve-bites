import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ValidationMessages, validationMessages } from 'src/app/utils/messages';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  template: `
    <div [formGroup]="formGroup || form">
      <mat-form-field [appearance]="appearance" style="width: 100%;">
        <mat-label>{{ label }}</mat-label>
        <mat-select
          #select
          [value]="value"
          (closed)="onBlur()"
          [multiple]="multiple"
          [formControlName]="name || 'name'"
          (selectionChange)="handleChange($event.value)"
        >
          <mat-option *ngFor="let option of options" [value]="option.value">
            {{ option.content }}
          </mat-option>
          <mat-option disabled>Please select</mat-option>
        </mat-select>

        <button
          *ngIf="select.value"
          matSuffix
          mat-icon-button
          type="button"
          (click)="handleClear($event, select)"
        >
          <mat-icon>close</mat-icon>
        </button>

        <mat-error *ngIf="errors && !!errorMessage">
          {{ errorMessage }}
        </mat-error>
      </mat-form-field>
    </div>
  `,
})
export class AppSelectComponent {
  @Input({ transform: booleanAttribute }) multiple = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() label!: string;
  @Input() formGroup?: FormGroup;
  @Input() name?: string;
  @Input() options?: { value: string; content: string }[];
  @Input() value?: string | string[];
  @Input() errors?: any;
  @Output() selectionChange = new EventEmitter<string | string[]>();

  errorMessage: string = '';

  form = new FormGroup({
    name: new FormControl(''),
  });

  onBlur() {
    for (let key in this.errors) {
      this.errorMessage = validationMessages[key as keyof ValidationMessages];
      break;
    }
  }

  handleChange(option: string | string[]) {
    this.selectionChange.emit(option);
  }

  handleClear(event: any, select: any) {
    event.stopPropagation();
    select.value = null;
    this.handleChange(this.multiple ? [] : '');
  }
}
