'use client';

import { ChatRoom } from '@/components/chat/ChatRoom';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/app/contexts/ChatContext';

export default function ChatLayout() {
  const isMobile = useIsMobile();
  const { activeChat, setActiveChat } = useChat();

  const handleBackToList = () => {
    setActiveChat(null);
  };
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
      <div className="relative mx-auto h-full max-w-[935px] rounded-lg border shadow-md">
        {/* Mobile header - only shown when a chat is active */}
        {isMobile && activeChat && (
          <div className="absolute left-0 top-0 z-20 flex h-[60px] w-full items-center">
            <button
              onClick={handleBackToList}
              className="mr-3 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="relative flex h-full">
          {/* Sidebar - hidden on mobile when chat is active */}
          <div
            className={`${isMobile && activeChat ? 'hidden' : 'block'} w-full md:w-[350px]`}
          >
            <ChatSidebar />
          </div>

          {/* Chat area - full width on mobile when active */}
          <div
            className={`${isMobile && !activeChat ? 'hidden' : 'block'} flex-1`}
          >
            <ChatRoom />
          </div>
        </div>
      </div>
    </div>
  );
}
