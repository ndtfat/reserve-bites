import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-section-events',
  standalone: true,
  imports: [CommonModule],
  styles: [],
  template: `
    <h4 style="font-weight: 600; margin-bottom: 20px;">Events</h4>
    <div></div>
  `,
})
export class HomeSectionEventsComponent {}
