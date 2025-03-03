'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/lib/stores/user-stores';
import { useChatStore } from '@/lib/stores/chat-stores';
import { MessageInput } from '@/components/chat/message-input';
import { Message } from '@/app/types';
import { formatMessageTime } from '@/lib/mock-data';


interface ChatRoomProps {
  chatRoomId: string;
}

export function ChatRoom({ chatRoomId }: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userDetails } = useUserStore();
  const { messages, chatRoomDetails, fetchMessages, sendMessage } =
    useChatStore();
  const [inputText, setInputText] = useState('');

  const chatDetails = chatRoomDetails(chatRoomId);
  const chatName = chatDetails?.chatName || '';
  const avatarURL = chatDetails?.avatarURL || '';

  useEffect(() => {
    if (chatRoomId && userDetails.displayName) {
      fetchMessages(chatRoomId, userDetails.displayName);
    }
  }, [chatRoomId, userDetails.displayName, fetchMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim() && userDetails.displayName) {
      sendMessage({
        chatRoomId,
        text: inputText,
        name: userDetails.displayName,
        username: chatName,
      });
      setInputText('');
    }
  };

  return (
    <div className="absolute bottom-0 left-[130px] top-0 flex w-[calc(100%-130px)] flex-col border-l border-stone-300 dark:border-stone-700 md:left-[350px] md:w-[calc(100%-350px)]">
      {/* Chat header */}
      <div className="flex h-[60px] items-center gap-2 border-b border-stone-300 pl-2 dark:border-stone-700 md:gap-4 md:pl-10">
        <Link href={`/${chatName}`}>
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarImage src={avatarURL} alt={`${chatName}'s profile`} />
            <AvatarFallback>{chatName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/${chatName}`} className="font-medium">
          {chatName}
        </Link>
      </div>

      {/* Messages area */}
      <div className="flex flex-1 flex-col overflow-y-auto border-t border-stone-300 px-1 py-2 dark:border-stone-700 dark:[color-scheme:dark] md:px-5">
        {messages[chatRoomId]?.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={message.name === userDetails.displayName}
            avatarURL={avatarURL}
            chatName={chatName}
            showAvatar={shouldShowAvatar(messages[chatRoomId], index)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSendMessage}
      />
    </div>
  );
}

// Helper function to determine if we should show the avatar
// Only show avatar for the first message in a sequence from the same user
function shouldShowAvatar(
  messages: Message[] | undefined,
  index: number,
): boolean {
  if (!messages) return true;
  if (index === 0) return true;
  return messages[index].name !== messages[index - 1].name;
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  avatarURL: string;
  chatName: string;
  showAvatar: boolean;
}

function MessageBubble({
  message,
  isCurrentUser,
  avatarURL,
  chatName,
  showAvatar,
}: MessageBubbleProps) {
  return (
    <div
      className={`my-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && showAvatar ? (
        <Link href={`/${chatName}`} className="mr-2 mt-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarURL} alt={`${chatName}'s profile`} />
            <AvatarFallback>{chatName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        !isCurrentUser && <div className="w-8" /> // Spacer for alignment
      )}
      <div className="flex max-w-[80%] flex-col md:max-w-[50%]">
        <div
          className={`${
            isCurrentUser
              ? 'rounded-[30px] rounded-tr-sm bg-[#efefef] dark:bg-[#070707]'
              : 'rounded-[30px] rounded-tl-sm border border-stone-200 dark:border-stone-700'
          } p-2 text-xs md:p-4 md:text-sm`}
        >
          {message.text}
        </div>
        <div
          className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}
        >
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
