'use client';

import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  useLayoutEffect,
} from 'react';
import Link from 'next/link';
import TextareaAutosize from 'react-textarea-autosize';
import { Image as ImageIcon, Send, Smile, X } from 'lucide-react';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import {
  Conversation,
  MessageResponse,
  SendMessagePayload,
} from '@/app/types/chat.type';
import { MessageBubble } from '@/components/chat/MessageBubble';
import Image from 'next/image';
import { shouldShowTimestamp } from '@/app/helpers/formatMessage';
import { useUserId } from '@/app/hooks';
import { useSearchParams } from 'next/navigation';
import { getChat } from '@/app/api/conversation.api';
import { UserInfo } from '@/app/types';
import Loading from '@/components/Loading';
import { EmptyChat } from '@/components/chat/EmptyChat';
import { sendMessage } from '@/app/api/message.api';
import { useWebSocket } from '@/app/contexts';
import { uploadFileToSupabase } from '@/app/helpers/uploadFileToSupabase';
import { FilePreview } from '@/components/FilePreview';

export function ChatRoom() {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const currentUserId = useUserId();
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<UserInfo | null>(null);
  const [nextMessageId, setNextMessageId] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    messages,
    setMessages,
    conversationId,
    setConversationId,
    setConversations,
  } = useWebSocket();

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
        if (data.messages) {
          setMessages(data.messages.reverse() || []);
        }
        if (data.otherUser) {
          setCurrentChatUser(data.otherUser);
        }
        // Store the nextMessageId for loading more messages
        setNextMessageId(data.nextMessageId || null);
        setHasMoreMessages(!!data.nextMessageId);
      } catch (error) {
        console.log(error);
      } finally {
        setChatLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchChat();
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll to bottom on initial load or when sending a new message
    if (isInitialLoad || messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad, currentUserId]);

  // Function to load older messages
  const loadOlderMessages = async () => {
    if (
      !hasMoreMessages ||
      loadingMoreMessages ||
      !conversationId ||
      !nextMessageId
    )
      return;

    try {
      setLoadingMoreMessages(true);

      // Store current scroll position before loading more messages
      const container = messagesContainerRef.current;
      if (!container) return;

      const oldScrollHeight = container.scrollHeight;
      const oldScrollTop = container.scrollTop;

      // Get the first message element as a reference point
      const firstMessageElement = container.querySelector('.message-bubble');
      const firstMessageOffsetTop =
        firstMessageElement?.getBoundingClientRect().top;

      const data = await getChat({
        otherUserId: otherUserId as string,
        conversationId,
        nextMessageId,
        limit: 20, // You can adjust the limit as needed
      });

      if (data.messages && data.messages.length > 0) {
        // Update the messages state by adding older messages at the beginning
        setMessages((prevMessages) => [
          ...data.messages.reverse(),
          ...prevMessages,
        ]);

        // Update the nextMessageId for the next fetch
        setNextMessageId(data.nextMessageId || null);
        setHasMoreMessages(!!data.nextMessageId);

        // After rendering, restore scroll position
        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const heightDifference = newScrollHeight - oldScrollHeight;
            container.scrollTop = oldScrollTop + heightDifference;
          }
        });
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  // Handle scroll to detect when user reaches the top
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (
      container &&
      container.scrollTop <= 100 &&
      hasMoreMessages &&
      !loadingMoreMessages
    ) {
      loadOlderMessages();
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreMessages, loadingMoreMessages, nextMessageId]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedFile) || isUploading) return;

    let mediaUrl;

    try {
      setIsUploading(selectedFile !== null);

      // Upload file if selected
      if (selectedFile) {
        mediaUrl = await uploadFileToSupabase(selectedFile);
      }

      const newMessage: SendMessagePayload = {
        conversationId: conversationId != '' ? conversationId : null,
        content: inputText.trim() ? inputText.trim() : null,
        receiverId: currentChatUser?.id as string,
        mediaUrl: mediaUrl || null,
      };

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

      // Update conversations list
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

          // Move conversation to top of list
          updatedConversations.splice(existingIndex, 1);
          updatedConversations.unshift(existingConversation);

          return updatedConversations;
        } else {
          // Create new conversation if not found
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

      // Reset input
      setInputText('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Clean up the URL when component unmounts or file changes
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

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
        <Link href={`/profile/${currentChatUser.id}`}>
          <Image
            alt={currentChatUser.avatarUrl + ' avatar'}
            className="rounded-full object-cover sm:h-14 sm:w-14"
            src={
              currentChatUser.avatarUrl
                ? currentChatUser.avatarUrl.trim()
                : '/images/default-profile.png'
            }
            width={100}
            height={100}
          />
        </Link>
        <span className="font-semibold">{currentChatUser.username}</span>
      </div>

      <div
        ref={messagesContainerRef}
        className="scrollbar flex flex-1 flex-col overflow-y-auto border-t border-stone-300 px-1 py-2 dark:border-stone-700 dark:[color-scheme:dark] md:px-5"
      >
        <div className="m-4 flex h-[100px] flex-col items-center justify-center gap-2 px-4">
          <Link
            href={`/profile/${currentChatUser.id}`}
            className="flex flex-col items-center gap-2"
          >
            <Image
              alt={currentChatUser.avatarUrl + ' avatar'}
              className="rounded-full object-cover sm:h-14 sm:w-14"
              src={
                currentChatUser.avatarUrl
                  ? currentChatUser.avatarUrl.trim()
                  : '/images/default-profile.png'
              }
              width={100}
              height={100}
            />
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
            showTimestamp={shouldShowTimestamp(messages, index)}
            className="message-bubble" // Added a class for reference
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white px-4 py-3 dark:bg-[#1c1c1c]">
        {selectedFile && previewUrl && (
          <FilePreview
            fileType={'image'}
            previewUrl={previewUrl}
            onDelete={() => setSelectedFile(null)}
          />
        )}

        <div className="flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 dark:border-stone-700 dark:bg-[#262626]">
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
            disabled={isUploading}
          >
            <ImageIcon
              className={`h-5 w-5 ${isUploading ? 'text-gray-400' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={(inputText.trim() === '' && !selectedFile) || isUploading}
            className={isUploading ? 'text-gray-400' : ''}
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
