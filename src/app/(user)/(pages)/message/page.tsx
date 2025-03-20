'use client';
import { ChatProvider } from '@/app/contexts/ChatContext';
import ChatLayout from '@/components/chat/ChatLayout';

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}
