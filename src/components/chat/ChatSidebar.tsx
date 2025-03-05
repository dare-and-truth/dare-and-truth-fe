'use client';

import { useEffect, useState } from 'react';
import { ChatRoomPreview } from './ChatRoomPreview';
import { Skeleton } from '@/components/ui/skeleton';
import { Chat } from '@/app/types';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/app/contexts/ChatContext';

const mockUsers: Chat[] = [
  {
    chatId: '1',
    userId: '1',
    avatarURL: 'https://i.pravatar.cc/150?img=15',
    username: 'ryan_clark',
    lastMessage: 'Xin chào!',
    updated_at: '2025-03-05 13:55:58.897563',
  },
  {
    chatId: '2',
    userId: '2',
    avatarURL: 'https://i.pravatar.cc/150?img=20',
    username: 'julia_watson',
    lastMessage: 'Hôm nay bạn thế nào?',
    updated_at: '2025-03-04 13:45:32.654321',
  },
  {
    chatId: '3',
    userId: '3',
    avatarURL: 'https://i.pravatar.cc/150?img=25',
    username: 'michael_lee',
    lastMessage: 'Gặp nhau lúc 3h nhé!',
    updated_at: '2025-03-05 13:35:20.123456',
  },
  {
    chatId: '4',
    userId: '4',
    avatarURL: 'https://i.pravatar.cc/150?img=30',
    username: 'sophia_nguyen',
    lastMessage: 'Cảm ơn bạn!',
    updated_at: '2025-03-02 13:25:10.789012',
  },
  {
    chatId: '5',
    userId: '5',
    avatarURL: 'https://i.pravatar.cc/150?img=35',
    username: 'daniel_kim',
    lastMessage: 'Bạn có rảnh tối nay không?',
    updated_at: '2025-03-02 12:55:05.456789',
  },
  {
    chatId: '6',
    userId: '6',
    avatarURL: 'https://i.pravatar.cc/150?img=40',
    username: 'emily_smith',
    lastMessage: 'Chúng ta đã hoàn thành chưa?',
    updated_at: '2025-03-02 12:45:30.987654',
  },
  {
    chatId: '7',
    userId: '7',
    avatarURL: 'https://i.pravatar.cc/150?img=45',
    username: 'alex_johnson',
    lastMessage: 'Tôi sẽ gửi tài liệu sớm!',
    updated_at: '2025-03-02 12:35:45.321098',
  },
  {
    chatId: '8',
    userId: '8',
    avatarURL: 'https://i.pravatar.cc/150?img=50',
    username: 'linda_moore',
    lastMessage: 'Hãy cùng nhau học bài!',
    updated_at: '2025-03-02 12:25:15.654987',
  },
  {
    chatId: '9',
    userId: '9',
    avatarURL: 'https://i.pravatar.cc/150?img=55',
    username: 'william_brown',
    lastMessage: 'Nhớ đặt lịch hẹn nhé!',
    updated_at: '2025-03-02 12:15:55.789654',
  },
  {
    chatId: '10',
    userId: '10',
    avatarURL: 'https://i.pravatar.cc/150?img=60',
    username: 'olivia_wilson',
    lastMessage: 'Chúc ngủ ngon!',
    updated_at: '2025-03-02 12:05:40.456123',
  },
  {
    chatId: '11',
    userId: '11',
    avatarURL: 'https://i.pravatar.cc/150?img=65',
    username: 'ethan_taylor',
    lastMessage: 'Đừng quên kiểm tra email!',
    updated_at: '2025-03-02 11:55:20.789321',
  },
];

export function ChatSidebar() {
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const isMobile = useIsMobile();
  const { activeChat, setActiveChat } = useChat();
  // Hide sidebar on mobile when chat is selected
  useEffect(() => {
    if (isMobile && activeChat) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [isMobile, activeChat]);
  const handleBackToList = () => {
    setActiveChat(null);
    setSidebarVisible(true);
  };

  if (isMobile && !sidebarVisible) {
    return null;
  }

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  return (
    <>
      <div
        className={`${isMobile ? 'absolute inset-0 z-10 bg-white dark:bg-[#1c1c1c]' : 'relative'} flex h-full flex-col border-r border-stone-300 dark:border-stone-700`}
      >
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

        <div className="h-[calc(100%-60px)] w-full overflow-y-auto overflow-x-hidden dark:[color-scheme:dark]">
          {loading ? (
            <ChatRoomSkeleton />
          ) : (
            mockUsers.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => handleChatSelect(chat)}
                className="w-full text-left"
                aria-label={`Chat with ${chat.username}`}
              >
                <ChatRoomPreview
                  chat={chat}
                  isActive={activeChat?.chatId === chat.chatId}
                />
              </button>
            ))
          )}
        </div>
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
