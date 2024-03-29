import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IUser } from '../types/auth.type';
import { INotification, ISocketNotification } from '../types/notification';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRestaurant } from '../types/restaurant.type';
import { ChatRole, IMessage, ISocketMessage } from '../types/chat.type';

@Injectable({
  providedIn: 'root',
})
export class RealTimeService {
  private socket!: Socket;
  private SERVER_URL = environment.SERVER_URL;
  openedConversation = new BehaviorSubject<IRestaurant | null>(null);
  numUnReadChatBox = new BehaviorSubject<number>(0);

  constructor() {}

  connectSocket(userData: IUser) {
    this.socket = io(this.SERVER_URL);
    this.socket.on('socket-connected', () => {
      this.socket.emit('user', { uid: userData.id, socketId: this.socket.id });
    });
  }

  disconnectSocket() {
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

  startConversation(res: IRestaurant) {
    this.openedConversation.next(res);
  }

  sendMessage(payload: ISocketMessage) {
    this.socket.emit('send-message', payload);
  }

  receiveMessage(): Observable<any> {
    return new Observable((subcriber) => {
      this.socket.on('receive-message', (m: any) => {
        subcriber.next({
          conversationId: m.conversationId,
          senderId: m.sender.id,
          content: m.message,
          createdAt: m.createdAt,
        });
      });
    });
  }
}
