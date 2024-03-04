import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

type SnackbarType = 'success' | 'error' | 'warn';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private duration: number = 4000;

  type: SnackbarType = 'success';
  message: string = 'Message of snackbar';
  openSnackbar = new BehaviorSubject<boolean>(false);
  timeoutId: any;

  constructor() {}

  open(type: SnackbarType, message: string) {
    clearTimeout(this.timeoutId);

    this.type = type;
    this.message = message;
    this.openSnackbar.next(true);

    this.timeoutId = setTimeout(() => {
      this.openSnackbar.next(false);
    }, this.duration);
  }
}
