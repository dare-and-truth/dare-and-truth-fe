'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Send, Smile, X } from 'lucide-react';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import { Chat, Message, MessageList } from '@/app/types/chat.type';
import { MessageBubble } from '@/components/chat/MessageBubble';
import {
  shouldShowAvatar,
  shouldShowTimestamp,
} from '@/app/helpers/formatMessage';

interface ChatRoomProps {
  activeChat: Chat;
}

const MockDataDB: MessageList = {
  messages: [
    {
      chatId: '1',
      content: '',
      imgUrl:
        'https://ldzbpqvspnjrhgfgigev.supabase.co/storage/v1/object/public/uploads/6b41950b-aa50-4953-b015-e7948f22730b.png',
      senderId: '2d904da6-fd76-43ea-8887-0259581135df',
      updated_at: '2025-03-02 13:55:58.123456',
      id: '1',
    },
    {
      chatId: '1',
      content: '',
      imgUrl:
        'https://ldzbpqvspnjrhgfgigev.supabase.co/storage/v1/object/public/uploads/fef0bddd-2e6c-4ffb-9d8c-a3e947baf2ed.png',
      senderId: '102',
      updated_at: '2025-03-02 13:56:10.654321',
      id: '2',
    },
    {
      chatId: '2',
      content: '',
      imgUrl:
        'https://ldzbpqvspnjrhgfgigev.supabase.co/storage/v1/object/public/uploads/fef0bddd-2e6c-4ffb-9d8c-a3e947baf2ed.png',
      senderId: '103',
      updated_at: '2025-03-02 14:00:45.987654',
      id: '3',
    },
  ],
};

export function ChatRoom({ activeChat }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = localStorage.getItem('userId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const filteredMessages = MockDataDB.messages
      .filter((message) => message.chatId === activeChat.chatId)
      .sort(
        (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      );

    setMessages(filteredMessages);
  }, [activeChat.chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: Message = {
      chatId: activeChat.chatId,
      content: inputText,
      senderId: currentUser || '',
      imgUrl: selectedImage ? URL.createObjectURL(selectedImage) : '',
      updated_at: new Date().toISOString(),
      id: Date.now().toString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(inputText + emoji);
    inputRef.current?.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        !document.querySelector('.emoji-picker')?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#1c1c1c] md:left-[350px]">
      <div className="flex h-[60px] items-center gap-2 border-b border-stone-300 pl-6 dark:border-stone-700 md:gap-4 md:pl-6">
        <Link href="/profile">
          <Avatar className="h-10 w-10 cursor-pointer">
            {activeChat.avatarURL && (
              <AvatarImage
                src={activeChat.avatarURL}
                alt={`${activeChat.username}'s profile`}
              />
            )}
            <AvatarFallback>
              {activeChat.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <span className="font-medium">{activeChat.username}</span>
      </div>

      <div className="scrollbar flex flex-1 flex-col overflow-y-auto border-t border-stone-300 px-1 py-2 dark:border-stone-700 dark:[color-scheme:dark] md:px-5">
        <div className="m-4 flex h-[100px] flex-col items-center justify-center gap-2 px-4">
          <Link href="/profile" className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 cursor-pointer">
              <AvatarImage src={activeChat.avatarURL} alt="image profile" />
            </Avatar>
            <span className="text-md font-semibold">{activeChat.username}</span>
          </Link>
        </div>

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUser}
            avatarURL={activeChat.avatarURL}
            showAvatar={shouldShowAvatar(messages, index)}
            showTimestamp={shouldShowTimestamp(messages, index)}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white px-4 py-3 dark:bg-[#1c1c1c]">
        {selectedImage && (
          <div className="relative mb-2 flex items-center justify-start">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="h-20 w-20 rounded-lg"
            />
            <button
              className="absolute right-0 top-0 rounded-full bg-black bg-opacity-50 p-1"
              onClick={removeImage}
              aria-label="Remove image"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        )}

        <div className="relative flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 dark:border-stone-700 dark:bg-[#262626]">
          <button
            ref={emojiButtonRef}
            className="flex-shrink-0 p-1"
            type="button"
            onClick={toggleEmojiPicker}
            aria-label="Open emoji selector"
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </button>

          <TextareaAutosize
            ref={inputRef}
            className="scrollbar mx-2 flex-1 resize-none bg-transparent py-2 text-sm focus:outline-none dark:bg-[#262626] dark:text-white"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message..."
            maxRows={1}
            minRows={1}
            onKeyDown={handleKeyPress}
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            className="pr-2"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' && !selectedImage}
          >
            <Send className="h-5 w-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-10">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
