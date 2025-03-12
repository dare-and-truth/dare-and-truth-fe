'use client';

import { useEffect, useState } from 'react';
import { ChatRoomPreview } from './ChatRoomPreview';
import { Skeleton } from '@/components/ui/skeleton';
import { Conversation } from '@/app/types';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/app/contexts/ChatContext';
import { getConversations } from '@/app/api/conversation.api';
import { useUserId } from '@/app/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useWebSocket } from '@/app/contexts';
import { markReadConversation } from '@/app/api/message.api';

export function ChatSidebar() {
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const isMobile = useIsMobile();
  const { activeChat, setActiveChat, setCurrentFriend } = useChat();
  const userId = useUserId();
  const router = useRouter();
  const pathname = usePathname();

  const { conversations, setConversations } = useWebSocket();

  // Hide sidebar on mobile when chat is selected
  useEffect(() => {
    setSidebarVisible(!(isMobile && activeChat));
  }, [isMobile, activeChat]);

  // Fetch conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    };
    fetchConversations();
  }, []);

  // Handle chat selection
  const handleChatSelect = (conversation: Conversation) => {
    const otherUser = conversation.participants.find((p) => p.id !== userId);

    if (!otherUser) return;

    if (conversation.unreadMessages > 0) {
        markReadConversation(conversation.id)
        // Cập nhật danh sách conversation sau khi đánh dấu đã đọc
        setConversations((prevConversations) =>
          prevConversations.map((c) =>
            c.id === conversation.id ? { ...c, unreadMessages: 0 } : c,
          ),
        );
    }

    setActiveChat(conversation);
    setCurrentFriend(otherUser);

    router.push(`${pathname}?userId=${otherUser.id}`, { scroll: false });

  };

  // Handle going back to conversation list
  const handleBackToList = () => {
    setActiveChat(null);
    setSidebarVisible(true);
  };

  if (isMobile && !sidebarVisible) return null;

  return (
    <div
      className={`${
        isMobile
          ? 'absolute inset-0 z-10 bg-white dark:bg-[#1c1c1c]'
          : 'relative'
      } flex h-full flex-col border-r border-stone-300 dark:border-stone-700`}
    >
      {/* Header */}
      <div className="flex h-[60px] items-center justify-between border-b border-stone-300 px-4 dark:border-stone-700 md:px-5">
        <div className="flex items-center">
          {isMobile && activeChat && (
            <button
              onClick={handleBackToList}
              className="mr-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>
      </div>

      {/* Chat List */}
      <div className="scrollbar h-[calc(100%-60px)] w-full overflow-y-auto overflow-x-hidden dark:[color-scheme:dark]">
        {loading ? (
          <ChatRoomSkeleton />
        ) : (
          conversations.map((conversation) => {
            console.log(conversation);
            const otherUser = conversation.participants.find(
              (p) => p.id !== userId,
            );

            if (!otherUser) return null;

            return (
              <button
                key={conversation.id}
                onClick={() => handleChatSelect(conversation)}
                className="w-full text-left"
                aria-label={`Chat with ${otherUser.username}`}
              >
                <ChatRoomPreview
                  chat={conversation}
                  otherUser={otherUser}
                  isActive={activeChat?.id === conversation.id}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// Skeleton Loader
function ChatRoomSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </>
  );
}
