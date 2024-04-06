import { Component } from '@angular/core';
import { RealTimeService } from './services/realTime.service';
import { SnackbarService } from './services/snackbar.service';
import { SnackbarComponent } from './components/common/snackbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SnackbarComponent, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
    <snackbar />
  `,
})
export class AppComponent {
  constructor(private socket: RealTimeService, private _snackbar: SnackbarService) {}
  // openSnackbar() {
  //   this._snackbar.open('success', 'Message of snackbar');
  // }
}
