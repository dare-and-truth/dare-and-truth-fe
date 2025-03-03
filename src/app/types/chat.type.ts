export interface UserChat {
  displayName: string;
  avatarURL?: string;
}

export interface Message {
  name: string;
  text: string;
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  chatName: string;
  avatarURL?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  [key: string]: any; // For dynamic properties like `${username}NewMessage`
}
