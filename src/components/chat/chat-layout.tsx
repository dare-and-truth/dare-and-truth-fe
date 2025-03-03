'use client';

import { ChatRoom } from '@/components/chat/chat-room';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { CreateChatRoomModal } from '@/components/chat/create-chat-room-modal';
import { EmptyChat } from '@/components/chat/empty-chat';
import { Header } from '@/components/header/hearder';
import { useChatStore } from '@/lib/stores/chat-stores';
import { useUserStore } from '@/lib/stores/user-stores';
import { useState, useEffect } from 'react';


export default function ChatLayout() {
  const [activeChat, setActiveChat] = useState('');
  const [createChatRoom, setCreateChatRoom] = useState(false);
  const { userDetails, userStatus } = useUserStore();
  const { fetchChatRooms } = useChatStore();

  useEffect(() => {
    if (userStatus && userDetails.displayName) {
      fetchChatRooms(userDetails.displayName);
    }
  }, [userStatus, userDetails.displayName, fetchChatRooms]);

  if (!userStatus) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your chats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen cursor-default overflow-hidden bg-[#fafafa] text-[#231f20] dark:bg-[#131313] dark:text-slate-100 dark:[color-scheme:dark]">
      {/* <Header page="Inbox" /> */}

      {createChatRoom && (
        <CreateChatRoomModal setCreateChatRoom={setCreateChatRoom} />
      )}

      <div className="relative mx-auto h-[calc(100%-140px)] max-w-[935px] border border-stone-300 bg-white dark:border-stone-700 dark:bg-[#1c1c1c] sm:h-[calc(100%-90px)]">
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          setCreateChatRoom={setCreateChatRoom}
        />

        {activeChat ? (
          <ChatRoom chatRoomId={activeChat} />
        ) : (
          <EmptyChat setCreateChatRoom={setCreateChatRoom} />
        )}
      </div>
    </div>
  );
}
