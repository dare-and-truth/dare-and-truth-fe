export interface Chat {
  chatId: string;
  userId: string;
  avatarURL: string;
  username: string;
  lastMessage: string;
  updated_at: string;
}

export interface Message {
  chatId: string;
  content: string;
  imgUrl: string;
  senderId: string;
  updated_at: string;
  id: string;
}

export interface MessageList {
  messages: Message[];
}

export interface ChatRoomPreviewProps {
  chat: Chat;
  isActive: boolean;
}

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export interface ChatContextType {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  avatarURL: string;
  showAvatar: boolean;
  showTimestamp: boolean;
}
