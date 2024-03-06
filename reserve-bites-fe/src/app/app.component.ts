import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <snackbar />
  `,
})
export class AppComponent {
  constructor(
    private socket: SocketService,
    private _snackbar: SnackbarService,
  ) {}
  // openSnackbar() {
  //   this._snackbar.open('success', 'Message of snackbar');
  // }
}
