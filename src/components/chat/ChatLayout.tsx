'use client';

import { useState } from 'react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { EmptyChat } from '@/components/chat/EmptyChat';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ChatLayout() {
  const [activeChat, setActiveChat] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your chats</p>
        </div>
      </div>
    );
  }
  const handleBackToList = () => {
    setActiveChat('');
  };
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
      <div className="relative mx-auto h-full max-w-[935px] border border-stone-300 bg-white dark:border-stone-700 dark:bg-[#1c1c1c]">
        {/* Mobile header - only shown when a chat is active */}
        {isMobile && activeChat && (
          <div className="absolute left-0 top-0 z-20 flex h-[60px] w-full items-center border-b border-stone-300 bg-white px-4 dark:border-stone-700 dark:bg-[#1c1c1c]">
            <button
              onClick={handleBackToList}
              className="mr-3 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold">Chat</h1>
          </div>
        )}

        {/* Main content */}
        <div className="relative flex h-full">
          {/* Sidebar - hidden on mobile when chat is active */}
          <div
            className={`${isMobile && activeChat ? 'hidden' : 'block'} w-full md:w-[350px]`}
          >
            <ChatSidebar
              activeChat={activeChat}
              setActiveChat={setActiveChat}
            />
          </div>

          {/* Chat area - full width on mobile when active */}
          <div
            className={`${isMobile && !activeChat ? 'hidden' : 'block'} flex-1`}
          >
            {activeChat ? <ChatRoom chatId={activeChat} /> : <EmptyChat />}
          </div>
        </div>
      </div>
    </div>
  );
}
