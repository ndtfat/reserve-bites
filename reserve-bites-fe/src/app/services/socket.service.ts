import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IUser } from '../types/auth.type';
import { INotification, ISocketNotification } from '../types/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private SERVER_URL = environment.SERVER_URL;

  constructor() {}

  connect(userData: IUser) {
    this.socket = io(this.SERVER_URL);
    this.socket.on('socket-connected', () => {
      this.socket.emit('user', { uid: userData.id, socketId: this.socket.id });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendNotification(payload: ISocketNotification) {
    this.socket.emit('send-notification', payload);
  }

  receiveNotification(): Observable<INotification> {
    return new Observable((subcriber) => {
      this.socket.on('receive-notification', (notification: INotification) => {
        console.log('receive-notification', notification);
        subcriber.next(notification);
      });
    });
  }
}
