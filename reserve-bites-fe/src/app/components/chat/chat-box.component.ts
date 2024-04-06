import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { RealTimeService } from 'src/app/services/realTime.service';
import { UserService } from 'src/app/services/user.service';
import { ChatRole, ChatTab, IChatBox, IMessage } from 'src/app/types/chat.type';
import { AuthService } from './../../services/auth.service';
import { ionArrowRedo } from '@ng-icons/ionicons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'chat-box',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    NgIconsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  viewProviders: [provideIcons({ heroUserCircleSolid, ionArrowRedo })],
  styles: [
    `
      @import '../../scss/common.scss';
      @import '../../scss/variables.scss';
      $window-width: 450px;
      $heder-height: 70px;

      .wrapper {
        @include shadow;
        border-radius: 4px;
        overflow: hidden;
        width: $window-width;
        &.chat-box .content {
          transform: translateX(-$window-width/2);
        }

        .content {
          width: calc($window-width * 2);
          height: 100%;
          @include flex(row, flex-start, flex-start);
          background: #fff;
          transition: 0.2s;
        }
        .chat-box,
        .chat-list {
          width: $window-width;
          height: 70vh;
          .header {
            height: $heder-height;
            padding: 10px 14px;
            @include flex(row, center, flex-start);
            border-bottom: 1px solid #ccc;
          }
        }
      }

      // Chat LIST
      .chat-list {
        & .header {
          justify-content: center !important;
        }
        .body {
          @include scrollbar;
          height: calc(100% - $header-height);
          overflow-y: auto;
        }
        .body > li > div {
          padding: 14px 20px;
          @include flex(row, center, flex-start);
          gap: 10px;
          &:hover {
            background: #f8f7f7;
            @include cursor;
          }
          img {
            @include img-fit(40px, 40px);
            border-radius: 50%;
          }
          .history-content {
            flex: 1;
            h6,
            .un-readed {
              font-weight: bold;
            }
            p {
              font-size: 14px;
              margin-top: 4px;
            }
          }
          .dot {
            @include onlineDot;
          }
        }
      }

      // CHAT BOx
      .chat-box {
        @include flex(column, center, center);
        & > * {
          width: 100%;
        }
        .header .back-btn {
          font-size: 20px;
          margin-right: 10px;
        }
        .body {
          flex: 1;
          padding: 10px 14px 0;
          overflow-y: auto;
          @include scrollbar;
          .date-divider {
            position: relative;
            margin: 20px 0;
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
            p {
              max-width: 80%;
              word-wrap: break-word;
            }
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
    <div class="wrapper" [ngClass]="{ history: tab === 'history', 'chat-box': tab === 'chat-box' }">
      <div class="content">
        <!-- Chat list -->
        <div class="chat-list">
          <div class="header">
            <h4>Messages</h4>
          </div>
          <ul class="body">
            <li *ngFor="let cb of chatBoxes" (click)="handleOpenChatBox(cb.id)">
              <div>
                <img *ngIf="cb.avatarUrl" [src]="cb.avatarUrl" />
                <ng-icon *ngIf="!cb.avatarUrl" name="heroUserCircleSolid" size="40" />

                <div class="history-content">
                  <h6>{{ cb.name }}</h6>
                  <p [ngClass]="{ 'un-readed': !cb.readed }">
                    {{ cb.messages[cb.messages.length - 1].sender === 'me' ? '(You)' : '' }}
                    {{ cb.messages[cb.messages.length - 1].content }}
                  </p>
                </div>

                <div *ngIf="!cb.readed" class="dot"></div>
              </div>
              <mat-divider style="margin: 0 20px;" />
            </li>

            <div
              *ngIf="chatBoxes.length === 0"
              [style]="{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              There is no conversation
            </div>
          </ul>
        </div>

        <!-- Chat box  -->
        <div class="chat-box">
          <div class="header">
            <button mat-icon-button class="back-btn" (click)="handleBackHistory()">
              <mat-icon>keyboard_arrow_left</mat-icon>
            </button>
            <h4>{{ openedChatBox?.name }}</h4>
          </div>
          <div class="body" #chatboxBody>
            <div *ngFor="let mess of openedChatBox?.messages; let i = index">
              <div
                *ngIf="openedChatBox && isNewDate(openedChatBox.messages, i)"
                class="date-divider"
              >
                <mat-divider />
                <span>{{ mess.createdAt | date }}</span>
              </div>
              <div
                class="chat-bubble"
                [ngClass]="{
                  left: mess.sender === 'you',
                  right: mess.sender === 'me'
                }"
              >
                <p
                  [matTooltip]="
                    mess.createdAt.toLocaleString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })
                  "
                >
                  {{ mess.content }}
                </p>
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
  chatBoxes: IChatBox[] = [];
  openedChatBox: IChatBox | null = null;
  @ViewChild('chatboxBody', { static: false }) chatboxBody: ElementRef | undefined;

  constructor(
    private auth: AuthService,
    private userSv: UserService,
    private realTime: RealTimeService,
  ) {
    this.refetchGetChatBoxes();

    realTime.openedConversation.subscribe((res) => {
      const chatBox = this.chatBoxes.find((cb) => cb.chatWithId === res?.owner.id);
      if (chatBox) {
        this.tab = ChatTab.CHATBOX;
        this.openedChatBox = chatBox;
      } else if (res) {
        this.tab = ChatTab.CHATBOX;
        this.openedChatBox = {
          id: '',
          chatWithId: res?.owner.id,
          name: res.name,
          avatarUrl: res.mainImage.url,
          messages: [],
          readed: true,
        };
      }
    });

    realTime.receiveMessage().subscribe(({ conversationId, senderId, content, createdAt }) => {
      const newMess = { sender: ChatRole.YOU, content: content, createdAt };

      if (this.openedChatBox) {
        this.openedChatBox.messages.push(newMess);
      }
      this.refetchGetChatBoxes();

      // use setTimeout to make sure messages updated before scroll
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
  }

  refetchGetChatBoxes() {
    this.userSv.getChatBoxes().subscribe((res) => (this.chatBoxes = res));
  }

  // chat list handlers-------------------------------------------------------------------------------------------
  handleOpenChatBox(id: string) {
    this.tab = ChatTab.CHATBOX;
    const chatBox = this.chatBoxes.find((cb) => cb.id === id);
    if (chatBox) {
      this.openedChatBox = chatBox;
      setTimeout(() => {
        this.scrollToBottom();
      });

      if (!chatBox.readed) {
        this.userSv.markChatBoxReaded(id);
        this.chatBoxes = this.chatBoxes.map((cb) => {
          if (cb.id === chatBox.id) return { ...cb, readed: true };
          else return { ...cb };
        });
      }
    }
  }

  // chat box handlers-------------------------------------------------------------------------------------------
  scrollToBottom(): void {
    if (this.chatboxBody) {
      this.chatboxBody.nativeElement.scrollTop = this.chatboxBody.nativeElement.scrollHeight;
    }
  }
  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    const line = 4;

    const lineHeight = getComputedStyle(textarea).lineHeight;
    const maxHeight = line * parseFloat(lineHeight);
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
      event.preventDefault();
      this.sendMessage(textarea);
    }
  }
  async sendMessage(textarea: HTMLTextAreaElement) {
    const value = textarea.value.trim();
    textarea.value = '';
    textarea.focus();
    if (this.chatboxBody && value) {
      this.openedChatBox?.messages.push({
        sender: ChatRole.ME,
        content: value,
        createdAt: new Date(),
      });

      if (this.openedChatBox && !this.openedChatBox?.id) {
        const { chatBoxId } = await this.userSv.createChatBox({
          senderId: this.auth.user.value?.id as string,
          receiverId: this.openedChatBox?.chatWithId as string,
        });
        this.openedChatBox = { ...this.openedChatBox, id: chatBoxId };
        this.chatBoxes.unshift({ ...this.openedChatBox, id: chatBoxId });
        this.refetchGetChatBoxes();
      }

      if (this.openedChatBox?.id) {
        this.realTime.sendMessage({
          conversationId: this.openedChatBox.id,
          senderId: this.auth.user.value?.id as string,
          receiverId: this.openedChatBox?.chatWithId as string,
          message: value,
        });
      }

      // use setTimeout to make sure messages updated before scroll
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }
  handleBackHistory() {
    this.tab = ChatTab.HISTORY;
    this.openedChatBox = null;
  }
}
