import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { AppSelectComponent } from 'src/app/components/common/app-select.component';
import { FormInputComponent } from 'src/app/components/common/form-input.component';
import { dayOptions } from 'src/app/utils/form';

@Component({
  selector: 'form-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    AppSelectComponent,
    FormInputComponent,
    ReactiveFormsModule,
  ],
  template: `
    <form [formGroup]="filterForm">
      <h3 style="margin-bottom: 30px;">Filter</h3>

      <form-input [formGroup]="filterForm" name="name" label="Restaurant name" />
      <form-input
        [formGroup]="filterForm"
        name="address"
        label="Address"
        placeholder="Province, Country"
      />

      <div style="display: flex; gap: 10px; width: 100%;">
        <div style="width: 30%;">
          <form-input [formGroup]="filterForm" name="size" type="number" label="Size" />
        </div>
        <div style="flex: 1; min-width: 10px;">
          <app-select
            name="openDay"
            label="Open day"
            [options]="dayOptions"
            [formGroup]="filterForm"
          />
        </div>
      </div>

      <div style="display: flex; align-items: center">
        <h6 style="margin-right: 20px;">Rating:</h6>
        <mat-slider min="0" max="5" step="1" discrete style="flex: 1;">
          <input value="0" matSliderStartThumb formControlName="minRate" />
          <input value="5" matSliderEndThumb formControlName="maxRate" />
        </mat-slider>
      </div>

      <div
        style="margin-top: 30px; width: 100%; display: flex; justify-content: space-between; gap: 20px"
      >
        <button mat-raised-button style="flex: 1" (click)="reset.emit()">Reset</button>
        <button mat-raised-button style="flex: 1" color="primary" (click)="search.emit()">
          Search
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class FormSearchFilterComponent {
  @Input() filterForm!: FormGroup;
  @Output() search = new EventEmitter();
  @Output() reset = new EventEmitter();

  dayOptions = dayOptions;
}
