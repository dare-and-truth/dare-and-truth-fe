import { UserInfo } from '@/app/types/user.type';

export interface Chat {
  conversationId: string;
  userId: string;
  avatarURL: string;
  username: string;
  lastMessage: string;
  updated_at: string;
}

export interface Message {
  conversationId: string;
  content: string;
  mediaUrl: string;
  senderId: string;
  sentAt: string;
  id: string;
}

export type SendMessagePayload = {
  receiverId: string;
  conversationId: string | null;
  content: string | null;
  // mediaUrl: string | null;
};

export type MessageResponse = {
  id: string;
  senderId: string;
  conversationId?: string;
  content?: string;
  mediaUrl?: string;
  sentAt: string;
};

export interface MessageList {
  messages: Message[];
}

export interface ChatRoomPreviewProps {
  chat: Conversation;
  isActive: boolean;
  otherUser: UserInfo;
}

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export interface ChatContextType {
  activeChat: Conversation | null;
  setActiveChat: (chat: Conversation | null) => void;
  currentFriend: UserInfo;
  setCurrentFriend: (friend: UserInfo) => void;
}

export interface MessageBubbleProps {
  message: MessageResponse;
  isCurrentUser: boolean;
  showTimestamp: boolean;
}

export type Conversation = {
  id: string;
  participants: UserInfo[];
  lastMessage: {
    content: string;
    senderId: string;
  };
  unreadMessages: number;
  updatedAt: string;
};
