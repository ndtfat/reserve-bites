import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'image',
  standalone: true,
  imports: [NgIf],
  styles: [
    `
      .skeleton {
        width: 100%;
        height: 100%;
        background: #eee;
        background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
        border-radius: 5px;
        background-size: 200% 100%;
        animation: 1.5s shine linear infinite;
      }
      @keyframes shine {
        to {
          background-position-x: -200%;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="!src" class="skeleton"></div>
    <img *ngIf="src" [src]="src" />
  `,
})
export class ImageComponent {
  @Input() src?: string;
}
