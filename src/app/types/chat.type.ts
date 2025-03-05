export interface Chat {
  id: string;
  name: string; // Array of user IDs
}

export interface UserChat {
  chatId: string;
  avatarURL: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: number;
}

interface ChatRoomProps {
  chatId: string;
  userId: string;
}

export interface Message {
  chat_id: string;
  content: string;
  sender_id: string;
  time: string;
  id: string;
}

export interface ChatData {
  chats: Chat[];
  chat_users: { chat_id: string; user_id: string }[];
  messages: Message[];
}

export interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
}

export interface ChatRoomPreviewProps {
  chat: UserChat;
  isActive: boolean;
  userId: string;
}

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export interface ChatSidebarProps {
  activeChat: string;
  setActiveChat: (chatId: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  avatarURL: string;
  chatName: string;
  showAvatar: boolean;
  showTimestamp: boolean;
}