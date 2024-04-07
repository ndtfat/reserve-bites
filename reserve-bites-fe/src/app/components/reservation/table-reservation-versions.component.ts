import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { ReservationStatus } from 'src/app/types/restaurant.type';

@Component({
  selector: 'table-reservation-versions',
  standalone: true,
  imports: [CommonModule, MatTableModule, TimePipe],
  styles: [
    `
      @import '../../scss/common.scss';
      .status {
        @include statusChip;
      }
    `,
  ],
  template: ` <table
    mat-table
    [dataSource]="dataSource"
    class="mat-elevation-z001"
    style="box-shadow: none;"
  >
    <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

    <!-- Position Column -->
    <ng-container matColumnDef="size">
      <th mat-header-cell *matHeaderCellDef>Size</th>
      <td mat-cell *matCellDef="let element">{{ element.size }}</td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="time">
      <th mat-header-cell *matHeaderCellDef>Time</th>
      <td mat-cell *matCellDef="let element">{{ element.time | time }}</td>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="date">
      <th mat-header-cell *matHeaderCellDef>Date</th>
      <td mat-cell *matCellDef="let element">{{ element.date | date : 'dd/MM/yyyy' }}</td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="createdAt">
      <th mat-header-cell *matHeaderCellDef>Create date</th>
      <td mat-cell *matCellDef="let element">{{ element.createdAt | date : 'dd/MM/yyyy' }}</td>
    </ng-container>

    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef>Status</th>
      <td mat-cell *matCellDef="let element">
        <p [class]="'status ' + element.status">
          {{ element.status }}
        </p>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>`,
})
export class TableReservationVersionsComponent {
  @Input() dataSource: {
    time: Date | string;
    date: Date | string;
    size: number;
    createdAt: Date | string;
    status: ReservationStatus;
  }[] = [];
  displayedColumns: string[] = ['size', 'time', 'date', 'createdAt', 'status'];
}
