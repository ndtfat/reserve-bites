export enum ChatRole {
    ME = 'me',
    YOU = 'you',
}

export enum ChatTab {
    HISTORY = "history",
    CHATBOX = 'chat-box',
}

export type IMessage = {
    sender: ChatRole,
    content: string,
    createdAt: Date,
}

export type IChatHistory = {
    id: string;
    name: string;
    avatarUrl?: string;
    lastMessage: string;
    seen: boolean;
}