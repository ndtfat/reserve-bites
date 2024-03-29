export enum ChatRole {
  ME = 'me',
  YOU = 'you',
}

export enum ChatTab {
  HISTORY = 'history',
  CHATBOX = 'chat-box',
}

export type IMessage = {
  sender: ChatRole;
  content: string;
  createdAt: Date;
};

export type IChatBox = {
  id: string;
  chatWithId: string;
  name: string;
  avatarUrl?: string;
  messages: IMessage[];
  readed: boolean;
};

export type ISocketMessage = {
  conversationId: string | undefined;
  senderId: string;
  receiverId: string;
  message: string;
};
