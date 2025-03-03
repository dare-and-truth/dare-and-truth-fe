'use client';

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { ChatRoomPreview } from './chat-room-preview';

import { Skeleton } from '@/components/ui/skeleton';
import { useChatStore } from '@/lib/stores/chat-stores';
import { useUserStore } from '@/lib/stores/user-stores';

interface ChatSidebarProps {
  activeChat: string;
  setActiveChat: (chatId: string) => void;
  setCreateChatRoom: (open: boolean) => void;
}

export function ChatSidebar({
  activeChat,
  setActiveChat,
  setCreateChatRoom,
}: ChatSidebarProps) {
  const [loading, setLoading] = useState(true);
  const { userDetails } = useUserStore();
  const { chatRooms, fetchChatRooms, resetNewMessage } = useChatStore();

  useEffect(() => {
    const loadChatRooms = async () => {
      await fetchChatRooms(userDetails.displayName || '');
      setLoading(false);
    };

    if (userDetails.displayName) {
      loadChatRooms();
    }
  }, [userDetails.displayName, fetchChatRooms]);

  const handleChatSelect = (chatRoomId: string) => {
    setActiveChat(chatRoomId);
    if (userDetails.displayName) {
      resetNewMessage(userDetails.displayName, chatRoomId);
    }
  };

  return (
    <>
      <div className="flex h-[60px] w-[130px] items-center border-b border-stone-300 dark:border-stone-700 md:w-[350px] md:px-5">
        <h1 className="mx-auto">{userDetails.displayName}</h1>
        <button
          onClick={() => setCreateChatRoom(true)}
          type="button"
          className="p-1"
          aria-label="Create new message"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="h-[calc(100%-60px)] w-[130px] overflow-y-auto overflow-x-hidden dark:[color-scheme:dark] md:w-[350px]">
        {loading ? (
          <ChatRoomSkeleton />
        ) : (
          chatRooms.map((chatRoom) => (
            <button
              key={chatRoom.id}
              onClick={() => handleChatSelect(chatRoom.id)}
              className="w-full text-left"
              aria-label={`Chat with ${chatRoom.chatName}`}
            >
              <ChatRoomPreview
                chatRoom={chatRoom}
                isActive={activeChat === chatRoom.id}
                username={userDetails.displayName || ''}
              />
            </button>
          ))
        )}
      </div>
    </>
  );
}

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
