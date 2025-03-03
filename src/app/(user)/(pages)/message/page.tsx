import type { Metadata } from 'next';
import ChatLayout from '@/components/chat/chat-layout';

export const metadata: Metadata = {
  title: 'Instagram • Chats',
  description: 'Instagram Clone Chat Interface',
};

export default function InboxPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden p-2 md:pb-4">
      <ChatLayout />
    </div>
  );
 
}
