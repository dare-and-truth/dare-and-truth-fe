'use client';

import { useEffect, useState } from 'react';
import { ChatRoomPreview } from './ChatRoomPreview';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatSidebarProps, UserChat } from '@/app/types';
import { ChevronLeft, Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const mockUsers: UserChat[] = [
  {
    chatId: '1',
    avatarURL: 'https://i.pravatar.cc/150?img=15',
    userName: 'ryan_clark',
    lastMessage: 'Xin chào!',
    lastMessageTime: 1700000000,
  },
  {
    chatId: '2',
    avatarURL: 'https://i.pravatar.cc/150?img=20',
    userName: 'julia_watson',
    lastMessage: 'Hôm nay bạn thế nào?',
    lastMessageTime: 1699990000,
  },
  {
    chatId: '3',
    avatarURL: 'https://i.pravatar.cc/150?img=25',
    userName: 'michael_lee',
    lastMessage: 'Gặp nhau lúc 3h nhé!',
    lastMessageTime: 1699980000,
  },
  {
    chatId: '4',
    avatarURL: 'https://i.pravatar.cc/150?img=30',
    userName: 'sophia_nguyen',
    lastMessage: 'Cảm ơn bạn!',
    lastMessageTime: 1699970000,
  },
  {
    chatId: '5',
    avatarURL: 'https://i.pravatar.cc/150?img=35',
    userName: 'daniel_kim',
    lastMessage: 'Bạn có rảnh tối nay không?',
    lastMessageTime: 1699900000,
  },
  {
    chatId: '6',
    avatarURL: 'https://i.pravatar.cc/150?img=40',
    userName: 'emily_smith',
    lastMessage: 'Chúng ta đã hoàn thành chưa?',
    lastMessageTime: 1699800000,
  },
  {
    chatId: '7',
    avatarURL: 'https://i.pravatar.cc/150?img=45',
    userName: 'alex_johnson',
    lastMessage: 'Tôi sẽ gửi tài liệu sớm!',
    lastMessageTime: 1699700000,
  },
  {
    chatId: '8',
    avatarURL: 'https://i.pravatar.cc/150?img=50',
    userName: 'linda_moore',
    lastMessage: 'Hãy cùng nhau học bài!',
    lastMessageTime: 1699600000,
  },
  {
    chatId: '9',
    avatarURL: 'https://i.pravatar.cc/150?img=55',
    userName: 'william_brown',
    lastMessage: 'Nhớ đặt lịch hẹn nhé!',
    lastMessageTime: 1699500000,
  },
  {
    chatId: '10',
    avatarURL: 'https://i.pravatar.cc/150?img=60',
    userName: 'olivia_wilson',
    lastMessage: 'Chúc ngủ ngon!',
    lastMessageTime: 1699400000,
  },
  {
    chatId: '11',
    avatarURL: 'https://i.pravatar.cc/150?img=65',
    userName: 'ethan_taylor',
    lastMessage: 'Đừng quên kiểm tra email!',
    lastMessageTime: 1699300000,
  },
];

export function ChatSidebar({ activeChat, setActiveChat }: ChatSidebarProps) {
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const isMobile = useIsMobile();
  // Hide sidebar on mobile when chat is selected
  useEffect(() => {
    if (isMobile && activeChat) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [isMobile, activeChat]);
  const handleBackToList = () => {
    setActiveChat('');
    setSidebarVisible(true);
  };

  if (isMobile && !sidebarVisible) {
    return null;
  }

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
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
                onClick={() => handleChatSelect(chat.chatId)}
                className="w-full text-left"
                aria-label={`Chat with ${chat.userName}`}
              >
                <ChatRoomPreview
                  chat={chat}
                  isActive={activeChat === chat.chatId}
                  userId={userId || ''}
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
