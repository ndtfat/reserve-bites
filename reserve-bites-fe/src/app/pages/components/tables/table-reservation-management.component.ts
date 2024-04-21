import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'table-reservation-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterLink, TimePipe],
  template: `
    <table
      *ngIf="dataSource"
      mat-table
      class="mat-elevation-z8"
      [dataSource]="dataSource"
      style="box-shadow: none;"
    >
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: columns"
        class="element-row"
        [routerLink]="'/reservation/' + row.id"
      ></tr>

      <ng-container *ngIf="isOwner" matColumnDef="diner">
        <th mat-header-cell *matHeaderCellDef>Diner</th>
        <td mat-cell *matCellDef="let element">
          <p class="ellipsis">
            {{ element.diner }}
          </p>
        </td>
      </ng-container>

      <ng-container *ngIf="isOwner" matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let element">
          <p class="ellipsis">
            {{ element.email }}
          </p>
        </td>
      </ng-container>

      <ng-container *ngIf="!isOwner" matColumnDef="restaurant">
        <th mat-header-cell *matHeaderCellDef>Restaurant</th>
        <td mat-cell *matCellDef="let element">
          <p class="ellipsis">
            {{ element.restaurant.name }}
          </p>
        </td>
      </ng-container>

      <ng-container matColumnDef="size">
        <th mat-header-cell *matHeaderCellDef>Party size</th>
        <td mat-cell *matCellDef="let element">{{ element.size }}</td>
      </ng-container>

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Date</th>
        <td mat-cell *matCellDef="let element">
          <p class="ellipsis">
            {{ element.date | date : 'MMM dd, yyyy' }}
          </p>
        </td>
      </ng-container>

      <!-- Symbol Column -->
      <ng-container matColumnDef="time">
        <th mat-header-cell *matHeaderCellDef>Time</th>
        <td mat-cell *matCellDef="let element">
          {{ element.time | time }}
        </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let element">
          <p [class]="'status ' + element.status">
            {{ element.status }}
          </p>
        </td>
      </ng-container>
    </table>
  `,
  styles: [
    `
      @import '../../../scss/common.scss';
      .element-row:hover {
        cursor: pointer;
        background: whitesmoke;
      }
      .ellipsis {
        font-size: 16px;
        @include ellipsis(1);
      }
      .status {
        @include status;
      }
    `,
  ],
})
export class TableReservationManagementComponent implements OnInit {
  @Input() fetching = false;
  @Input() dataSource: MatTableDataSource<any> | null = null;

  isOwner = false;
  columns: string[] = ['restaurant', 'size', 'date', 'time', 'status'];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user.subscribe((u) => {
      this.isOwner = u?.isOwner as boolean;
      if (u?.isOwner) {
        this.columns = ['diner', 'email', 'size', 'date', 'time', 'status'];
      }
    });
  }
}
