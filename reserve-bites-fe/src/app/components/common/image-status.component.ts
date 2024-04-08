import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Input, OnInit, Output, Component, EventEmitter, booleanAttribute } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { ionCloudUploadOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'image-status',
  standalone: true,
  imports: [CommonModule, NgIconsModule, MatProgressBarModule, MatIconModule, MatButtonModule],
  viewProviders: [provideIcons({ ionCloudUploadOutline })],
  styles: [
    `
      @import '../../scss/common.scss';
      .wrapper {
        @include flex(row, center, flex-start);
      }
      .upload-icon {
        font-size: 30px;
        margin-right: 20px;
      }
      .delete-icon {
        @include flex(row, center, center);
      }
      .content {
        flex: 1;
        p {
          color: #aaa;
          font-size: 14px;
        }
        .progress-bar {
          width: 160px;
        }
      }
    `,
  ],
  template: `
    <div class="wrapper" [ngClass]="{ error: errorMessage }">
      <ng-icon size="30" class="upload-icon" name="ionCloudUploadOutline" />
      <div class="content">
        <h6>{{ file.name }}</h6>
        <div style="margin: 4px 0 0;">
          <p style="margin-bottom: 2px;">
            {{
              progress === 100 ? (error || errorMessage ? 'Failed' : 'Finished') : 'Uploading...'
            }}
          </p>
          <p *ngIf="errorMessage || error" style="color: red">
            {{ errorMessage ? errorMessage : 'Upload file failed' }}
          </p>
        </div>
        <mat-progress-bar
          *ngIf="!errorMessage && !error"
          class="progress-bar"
          mode="determinate"
          [value]="errorMessage ? 100 : progress"
        />
      </div>
      <mat-icon
        *ngIf="progress === 100 && !error && !errorMessage"
        style="justify-self: flex-end; align-self: center; color: #5ad537; margin-right: 10px"
      >
        check_circle
      </mat-icon>
      <mat-icon
        *ngIf="errorMessage || error"
        style="justify-self: flex-end; align-self: center; color: red; margin-right: 10px"
      >
        cancel
      </mat-icon>
      <button mat-icon-button type="button" class="delete-icon" (click)="handleDelete()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
})
export class ImageStatusComponent implements OnInit {
  @Input() progress = 60;
  @Input() file!: any;
  @Input({ transform: booleanAttribute }) error = false;
  @Output() onDelete = new EventEmitter();

  errorMessage = '';
  ngOnInit() {
    if (this.file.type && !this.file.type.includes('image')) {
      this.errorMessage = 'Unsuported file';
    } else if (this.file.size && this.file.size > 1024 * 1024 * 3) {
      this.errorMessage = 'File too large (Max. 1MB)';
    }
  }

  handleDelete() {
    this.onDelete.emit();
  }
}
