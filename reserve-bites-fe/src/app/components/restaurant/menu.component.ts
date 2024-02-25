import { Component, Input } from '@angular/core';
import { IMenuCategory } from 'src/app/types/restaurant.type';

@Component({
  selector: 'menu',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      .content {
        @include flex(column, flex-start, flex-start);
        * {
          flex: 1;
        }
      }
      .dish {
        width: 100%;
        padding: 6px 0;
        @include flex(row, flex-start, flex-start);
        & > * {
          display: block;
          font-size: 16px;
        }
        &:hover {
          background-color: #eee;
        }
        p:first-child {
          flex: 2;
        }
      }
    `,
  ],
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let cat of menu">
        <mat-expansion-panel-header>
          <mat-panel-title style="font-size: 16px;">
            {{ cat.category }}
          </mat-panel-title>
        </mat-expansion-panel-header>
        <div class="content">
          <div *ngFor="let dish of cat.dishes" class="dish">
            <p>{{ dish.name }}</p>
            <p style="color: green">{{ dish.price }}</p>
            <p>{{ currency }}</p>
          </div>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  `,
})
export class MenuComponent {
  @Input() currency: string = 'VND';
  @Input() menu: IMenuCategory[] = [
    {
      category: 'Main dish',
      dishes: [
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
      ],
    },
    {
      category: 'Main dish',
      dishes: [
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
      ],
    },
    {
      category: 'Main dish',
      dishes: [
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
        { name: 'Pizza', price: 20000 },
      ],
    },
  ];
}
