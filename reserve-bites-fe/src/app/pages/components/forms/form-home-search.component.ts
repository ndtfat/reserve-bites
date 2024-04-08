import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppSelectComponent } from 'src/app/components/common/app-select.component';
import { MatButtonModule } from '@angular/material/button';
import { dayOptions } from 'src/app/utils/form';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'form-home-search',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    AppSelectComponent,
    ReactiveFormsModule,
  ],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="handleSearch()">
      <mat-form-field class="form-field-size">
        <mat-label>Size</mat-label>
        <input matInput type="number" name="size" />
      </mat-form-field>

      <app-select
        [formGroup]="searchForm"
        name="openDay"
        class="form-field-select"
        label="Open day"
        appearance="fill"
        [options]="dayOptions"
      />
      <button class="form-button" mat-raised-button color="primary" style="height: 56px;">
        Find a table
      </button>
    </form>
  `,
  styles: [
    `
      @import '../../../scss/responsive.scss';
      form > * {
        width: 100%;
      }

      @include tablet {
        form {
          width: 100%;
          display: flex;
          gap: 10px;

          .form-field-size {
            flex: 2;
          }
          .form-field-select {
            flex: 3;
          }
          .form-button {
            flex: 1;
          }
        }
      }
    `,
  ],
})
export class FormHomeSearchComponent {
  @Output() search = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  dayOptions = dayOptions;
  searchForm = this.fb.group({
    size: [1],
    openDay: [''],
  });

  handleSearch() {
    this.search.emit(this.searchForm.value);
  }
}
