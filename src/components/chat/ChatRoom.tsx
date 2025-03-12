'use client';

import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  useLayoutEffect,
} from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Send, Smile, X } from 'lucide-react';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import { Conversation, MessageResponse, SendMessagePayload } from '@/app/types/chat.type';
import { MessageBubble } from '@/components/chat/MessageBubble';
import {
  shouldShowAvatar,
  shouldShowTimestamp,
} from '@/app/helpers/formatMessage';
import { useUserId } from '@/app/hooks';
import { useSearchParams } from 'next/navigation';
import { getChat } from '@/app/api/conversation.api';
import { UserInfo } from '@/app/types';
import Loading from '@/components/Loading';
import { EmptyChat } from '@/components/chat/EmptyChat';
import { sendMessage } from '@/app/api/message.api';
import { useWebSocket } from '@/app/contexts';

export function ChatRoom() {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useUserId();
  const [chatLoading, setChatLoading] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<UserInfo | null>(null);

  const { messages, setMessages, conversationId, setConversationId, setConversations } =
    useWebSocket();

  const searchParams = useSearchParams();
  const otherUserId = searchParams.get('userId');

  useLayoutEffect(() => {
    const fetchChat = async () => {
      if (!otherUserId) return;
      try {
        setChatLoading(true);
        const data = await getChat({ otherUserId });
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
        if(data.messages){
          setMessages(data.messages.reverse() || []);
        }
        if (data.otherUser) {
          setCurrentChatUser(data.otherUser);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setChatLoading(false);
      }
    };
    fetchChat();
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage: SendMessagePayload = {
      conversationId: conversationId != '' ? conversationId : null,
      content: inputText,
      receiverId: currentChatUser?.id as string,
      // mediaUrl: selectedImage ? URL.createObjectURL(selectedImage) : '',
    };

    try {
      await sendMessage(newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          id: Date.now().toString(),
          sentAt: new Date().toISOString(),
          senderId: currentUserId,
        } as MessageResponse,
      ]);

      // Cập nhật danh sách đoạn hội thoại
      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex(
          (conversation) => conversation.id === conversationId,
        );

        if (existingIndex !== -1) {
          const updatedConversations = [...prevConversations];
          const existingConversation = {
            ...updatedConversations[existingIndex],
          };

          existingConversation.lastMessage = {
            content: newMessage.content as string,
            senderId: currentUserId as string,
          };
          existingConversation.unreadMessages = 0;
          existingConversation.updatedAt = new Date().toISOString();

          // Đưa cuộc trò chuyện lên đầu danh sách
          updatedConversations.splice(existingIndex, 1);
          updatedConversations.unshift(existingConversation);

          return updatedConversations;
        } else {
          // Nếu không tìm thấy, tạo cuộc trò chuyện mới
          const newConversation: Conversation = {
            id: conversationId,
            participants: [
              {
                id: currentChatUser?.id as string,
                username: currentChatUser?.username as string,
                avatarUrl: currentChatUser?.avatarUrl as string,
              },
            ],
            lastMessage: {
              content: newMessage.content as string,
              senderId: currentUserId as string,
            },
            unreadMessages: 0,
            updatedAt: new Date().toISOString(),
          };

          return [newConversation, ...prevConversations];
        }
      });
      
      // reset input
      setInputText('');
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.log(sendMessage);
    }
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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setSelectedImage(file);
  //   }
  // };

  // const removeImage = () => {
  //   setSelectedImage(null);
  //   if (fileInputRef.current) fileInputRef.current.value = '';
  // };

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

  if (chatLoading) {
    return <Loading />;
  }

  if (!currentChatUser) {
    return <EmptyChat />;
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#1c1c1c] md:left-[350px]">
      <div className="flex h-[60px] items-center gap-2 border-b border-stone-300 pl-6 dark:border-stone-700 md:gap-4 md:pl-6">
        <Link href="/profile">
          <Avatar className="h-10 w-10 cursor-pointer">
            {currentChatUser?.avatarUrl && (
              <AvatarImage
                src={currentChatUser.avatarUrl}
                alt={`${currentChatUser.username}'s profile`}
              />
            )}
            <AvatarFallback>
              {currentChatUser.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <span className="font-medium">{currentChatUser.username}</span>
      </div>

      <div className="scrollbar flex flex-1 flex-col overflow-y-auto border-t border-stone-300 px-1 py-2 dark:border-stone-700 dark:[color-scheme:dark] md:px-5">
        <div className="m-4 flex h-[100px] flex-col items-center justify-center gap-2 px-4">
          <Link href="/profile" className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 cursor-pointer">
              <AvatarImage src={currentChatUser.avatarUrl} alt="image profile" />
            </Avatar>
            <span className="text-md font-semibold">
              {currentChatUser.username}
            </span>
          </Link>
        </div>

        {messages.slice().map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
            avatarURL={currentChatUser.avatarUrl}
            showAvatar={shouldShowAvatar(messages, index)}
            showTimestamp={shouldShowTimestamp(messages, index)}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white px-4 py-3 dark:bg-[#1c1c1c]">
        {/* {selectedImage && (
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
        )} */}

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

          {/* <input
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
          </button> */}

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
