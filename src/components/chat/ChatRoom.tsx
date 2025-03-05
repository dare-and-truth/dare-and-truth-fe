'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageInput } from '@/components/chat/MessageInput';
import { Button } from '@/components/ui/button';
import { formatMessageTime } from '@/lib/format-time';
import { ChatData, Message, MessageBubbleProps } from '@/app/types/chat.type';
import { useIsMobile } from '@/hooks/use-mobile';
interface ChatRoomProps {
  chatId: string;
}

const MockDataDB: ChatData = {
  chats: [
    { id: '1', name: 'Chat 1' },
    { id: '2', name: 'Chat 2' },
  ],
  chat_users: [
    { chat_id: '1', user_id: '101' },
    { chat_id: '1', user_id: '102' },
    { chat_id: '2', user_id: '103' },
  ],
  messages: [
    {
      chat_id: '1',
      content: 'Hello!',
      sender_id: '101',
      time: '2024-03-04T10:00:00Z',
      id: '1',
    },
    {
      chat_id: '1',
      content: 'Hi there!',
      sender_id: '102',
      time: '2024-03-04T10:05:00Z',
      id: '2',
    },
    {
      chat_id: '2',
      content: 'Hey!',
      sender_id: '103',
      time: '2024-03-04T10:10:00Z',
      id: '3',
    },
  ],
};

export function ChatRoom({ chatId }: ChatRoomProps) {
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [inputText, setInputText] = useState('');
    const isMobile =useIsMobile();
  const avatarURL = 'https://i.pravatar.cc/150?img=15';
  const chatName = 'ryan_clark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId= '101'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const filteredMessages = MockDataDB.messages
      .filter((message) => message.chat_id === (chatId))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: filteredMessages,
    }));
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      chat_id: chatId,
      content: inputText,
      sender_id: userId,
      time: new Date().toISOString(),
      id: Date.now().toString(),
    };
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), newMessage],
    }));
    setInputText('');
  };

  function shouldShowTimestamp(
    messages: Message[] | undefined,
    index: number,
  ): boolean {
    if (!messages) return true;
    if (index === 0) return true;

    const currentMessageTime = new Date(messages[index].time).getTime();
    const previousMessageTime = new Date(messages[index - 1].time).getTime();

    if (messages[index].sender_id === messages[index - 1].sender_id) {
      const differenceInMinutes =
        Math.abs(currentMessageTime - previousMessageTime) / (1000 * 60);
      return differenceInMinutes >= 5;
    } else {
      return true;
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#1c1c1c] md:left-[350px]">
      <div className="flex h-[60px] items-center gap-2 border-b border-stone-300 pl-2 dark:border-stone-700 md:gap-4 md:pl-6">
        <Link href="/profile">
          <Avatar className="h-10 w-10 cursor-pointer">
            {avatarURL && (
              <AvatarImage src={avatarURL} alt={`${chatName}'s profile`} />
            )}
            <AvatarFallback>{chatName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <span className="font-medium">{chatName}</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto border-t border-stone-300 px-1 py-2 dark:border-stone-700 dark:[color-scheme:dark] md:px-5">
        <div className="m-10 flex h-[100px] flex-col items-center justify-center gap-2 px-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 cursor-pointer">
              {avatarURL ? (
                <AvatarImage src={avatarURL} alt={`${chatName}'s profile`} />
              ) : (
                <AvatarFallback>
                  {chatName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-md font-semibold">{chatName}</span>
          </div>
          <Link href="/profile">
            <Button variant="join" className="font-medium">
              View Profile
            </Button>
          </Link>
        </div>

        {messages[chatId]?.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender_id === userId}
            avatarURL={avatarURL}
            chatName={chatName}
            showAvatar={shouldShowAvatar(messages[chatId], index)}
            showTimestamp={shouldShowTimestamp(messages[chatId], index)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSendMessage}
      />
    </div>
  );
}

function shouldShowAvatar(
  messages: Message[] | undefined,   // chỉ hiển thị một ảnh đại dienj khi gửi nhiều tin
  index: number,
): boolean {
  if (!messages) return true;
  if (index === 0) return true;
  return messages[index].sender_id !== messages[index - 1].sender_id;
}


function MessageBubble({
  message,
  isCurrentUser,
  avatarURL,
  chatName,
  showAvatar,
  showTimestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={`my-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && showAvatar ? (
        <div className="mr-2 mt-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarURL} alt={`${chatName}'s profile`} />
            <AvatarFallback>{chatName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        !isCurrentUser && <div className="w-8" />
      )}
      <div className="group flex max-w-[60%] flex-col md:max-w-[50%]">
        <div
          className={`${
            isCurrentUser
              ? 'rounded-[10px] rounded-tr-sm bg-blue-600 text-white dark:bg-[#070707]'
              : 'rounded-[10px] rounded-tl-sm border border-stone-200 bg-gray-100 dark:border-stone-700'
          } p-2 text-xs md:p-3 md:text-sm`}
        >
          {message.content}
        </div>
        {showTimestamp ? (
          <div
            className={`mt-1 text-xs text-gray-500 ${
              isCurrentUser ? 'text-right' : 'text-left'
            }`}
          >
            {formatMessageTime(message.time)}
          </div>
        ) : (
          <div
            className={`mt-1 hidden text-xs text-gray-500 group-hover:block ${
              isCurrentUser ? 'text-right' : 'text-left'
            }`}
          >
            {formatMessageTime(message.time)}
          </div>
        )}
      </div>
    </div>
  );
}
