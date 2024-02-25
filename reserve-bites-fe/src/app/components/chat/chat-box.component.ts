import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ChatRole, ChatTab, IChatHistory, IMessage } from 'src/app/types/chat.type';

@Component({
  selector: 'chat-box',
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      $window-width: 450px;
      .wrapper {
        @include shadow;
        border-radius: 4px;
        overflow: hidden;
        width: $window-width;
        &.chat-box .content { transform: translateX(-$window-width/2); }

        .content { 
          width: calc($window-width * 2);
          height: 100%;
          @include flex(row, flex-start, flex-start);
          background: #fff;
          transition: .2s;
        }
        .chat-box, .chat-list { 
          width: $window-width; 
          height: 70vh; 
          .header {
            height: 70px;
            padding: 10px 14px;
            @include flex(row, center, flex-start);
            border-bottom: 1px solid #ccc;
          }
        }
      }

      // Chat LIST
      .chat-list {
        & .header { justify-content: center !important; }
        .body > li > div {
          padding: 14px 20px;
          @include flex(row, center, flex-start);
          gap: 10px;
          &:hover {
            background: #f8f7f7;
            @include cursor;
          }
          img { @include img-fit(40px, 40px); border-radius: 50%; }
          .history-content {
            flex: 1;
            h6, .not-seen { font-weight: bold; }
            p {
              font-size: 14px;
              margin-top: 2px;
            }
          }
          .point {
            width: 10px;
            height: 10px;
            background: green;
            border-radius: 50%;
          }
        }
      }

      // CHAT BOx
      .chat-box {
        @include flex(column, center, center);
        & > * { width: 100%; }
        .header .back-btn { font-size: 20px; margin-right: 10px; }
        .body {
          flex: 1;
          padding: 10px 14px 0;
          overflow-y: auto;
          @include scrollbar;
          .date-divider {
            position: relative;
            margin: 20px 0 10px;
            padding: 0 50px;
            span {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              background: #fff;
              padding: 0 10px;
            }
          }
          .chat-bubble {
            margin-bottom: 10px;
            p { max-width: 80%; word-wrap: break-word; }
          }
          .chat-bubble.left {
            @include flex(row, flex-end, flex-start);
            p {
              padding: 10px;
              background: #f2f2f2;
              margin-right: 10px;
              border-radius: 6px 18px 18px 18px / 6px 18px 18px 18px;
            }
          }
          .chat-bubble.right {
            @include flex(row-reverse, flex-end, flex-start);
            p {
              padding: 10px;
              background: $primary--blur;
              margin-left: 10px;
              border-radius: 18px 18px 6px 18px / 18px 18px 6px 18px;
            }
          }
        }
        .footer {
          padding: 14px;
          border-top: 1px solid #ccc;
          @include flex(row, center, flex-start);
          textarea {
            flex: 1;
            width: 100%;
            font-size: 18px;
            border: none;
            outline: none;
            resize: none;
          }
        }
      }
      
    `,
  ],
  template: `
    <div class="wrapper" [ngClass]="{history: tab === 'history', 'chat-box': tab === 'chat-box'}">
      <div class="content">
        <!-- Chat list -->
        <div class="chat-list">
          <div class="header">
            <h4>Messages</h4>
          </div>
          <ul class="body">
            <li *ngFor="let mess of chatHistory;" (click)="handleOpenChatBox(mess.id)">
              <div>
                <img *ngIf="mess.avatarUrl" [src]="mess.avatarUrl" />
                <ng-icon *ngIf="!mess.avatarUrl" name="heroUserCircleSolid" size="40"/>

                <div class="history-content">
                  <h6>{{mess.name}}</h6>
                  <p [ngClass]="{'not-seen': !mess.seen}">{{mess.lastMessage}}</p>
                </div>

                <div *ngIf="!mess.seen" class="point"></div>
              </div>
              <mat-divider style="margin: 0 20px;" />
            </li>
          </ul>
        </div>

        <!-- Chat box  -->
        <div class="chat-box">
          <div class="header">
            <button mat-icon-button class="back-btn" (click)="handleBackHistory()">
              <mat-icon>keyboard_arrow_left</mat-icon>
            </button>
            <h4>Bun bo di 2</h4>
          </div>
          <div class="body" #chatboxBody>
            <div *ngFor="let mess of messages; let i = index">
              <div *ngIf="isNewDate(messages, i)" class="date-divider">
                <mat-divider />
                <span>{{ mess.createdAt | date }}</span>
              </div>
              <div class="chat-bubble" [ngClass]="{left: mess.sender === 'you', right: mess.sender === 'me'}">
                <p>{{ mess.content }}</p>
                <span>{{ mess.createdAt.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <textarea
              #chatText
              type="text"
              placeholder="Type here..."
              rows="1"
              (input)="adjustTextareaHeight(chatText)"
              (keydown)="handleEnter($event, chatText)"
            ></textarea>
            <button mat-icon-button (click)="sendMessage(chatText)">
              <ng-icon name="ionArrowRedo" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChatBoxComponent implements AfterViewInit {
  tab: ChatTab = ChatTab.HISTORY;
  messages: IMessage[] = [
    { sender: ChatRole.YOU, content: 'Hello', createdAt: new Date(1703496013010), },
    { sender: ChatRole.ME, content: 'Hi', createdAt: new Date(1703496013010) },
    { sender: ChatRole.ME, content: 'Whats up', createdAt: new Date(1703496013010), },
    { sender: ChatRole.YOU, content: 'Can you lend me a pencil', createdAt: new Date(1703496113010), },
    { sender: ChatRole.ME, content: 'Of course', createdAt: new Date(1703496224010), },
    { sender: ChatRole.ME, content: 'No', createdAt: new Date(1703496224010) },
  ];
  chatHistory: IChatHistory[] = [
    { id: '', name: 'Bun bo`', seen: false, lastMessage: 'Ăn mấy tô con?', avatarUrl: '' },
    { id: '', name: 'Bun rieu`', seen: true, lastMessage: 'Mấy giờ con qua?', avatarUrl: 'https://resizer.otstatic.com/v2/photos/wide-medium/1/25229489.webp' }
  ]
  @ViewChild('chatboxBody', { static: false }) chatboxBody: ElementRef | undefined;

  // chat list handlers-------------------------------------------------------------------------------------------
  handleOpenChatBox(id: string) {
    this.tab = ChatTab.CHATBOX;
  }


  // chat box handlers-------------------------------------------------------------------------------------------
  scrollToBottom(): void {
    if (this.chatboxBody) {
      this.chatboxBody.nativeElement.scrollTop = this.chatboxBody.nativeElement.scrollHeight;
    }
  }
  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    const lineHeight = getComputedStyle(textarea).lineHeight;
    const maxHeight = 4 * parseFloat(lineHeight);
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
  }
  isNewDate(messages: IMessage[], index: number): boolean {
    if (index === 0) {
      return true; // Show the date for the first message
    }
    const currentMessageDate = new Date(messages[index].createdAt).toDateString();
    const previousMessageDate = new Date(messages[index - 1].createdAt).toDateString();
    return currentMessageDate !== previousMessageDate;
  }
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  handleEnter(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    if (event.key === 'Enter' && !event.shiftKey && !event.altKey) {
      this.sendMessage(textarea);
    }
  }
  sendMessage(textarea: HTMLTextAreaElement) {
    const value = textarea.value.trim();
    if (this.chatboxBody && value) {
      this.messages.push({ sender: ChatRole.ME, content: value, createdAt: new Date(), });
      textarea.value = '';
      textarea.focus();

      // use setTimeout to make sure messages updated before scroll
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }
  handleBackHistory() {
    this.tab = ChatTab.HISTORY;
  }
}