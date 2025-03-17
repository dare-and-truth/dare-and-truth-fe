'use client';

import { ChatContextType, Conversation, UserInfo } from '@/app/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [currentFriend, setCurrentFriend] = useState<UserInfo>({} as UserInfo);

  return (
    <ChatContext.Provider
      value={{ activeChat, setActiveChat, currentFriend, setCurrentFriend }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
