// context/WebSocketContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { Client } from '@stomp/stompjs';
import { toast, type ToastContentProps } from 'react-toastify';
import { FriendRequestNotificationToast } from '@/components/notificationToast/FriendRequestNotificationToast';
import { CommentNotificationToast } from '@/components/notificationToast/CommentNotificationToast';
import { LikeNotificationToast } from '@/components/notificationToast/LikeNotificationToast';
import { Conversation, MessageResponse } from '@/app/types';
import { getUnreadNotificationsCount } from '@/app/api/notification.api';
const SockJS = require('sockjs-client');

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
  messages: MessageResponse[];
  setMessages: React.Dispatch<React.SetStateAction<MessageResponse[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  conversationId: string;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  subscribeToChannel: (channel: string, callback: (data: any) => void) => any;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const conversationIdRef = useRef(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    const fetchUnreadNotification = async () => {
      const notificationCountRes =  await getUnreadNotificationsCount(userId as string);
    };

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: ` Bearer ${token}`,
      },
      onConnect: () => {
        setIsConnected(true);

        // Đăng ký nhận thông báo chung
        stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          handleNotification(notification);
        });

        // Đăng ký nhận tin nhắn
        stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
          const data = JSON.parse(message.body);

          setConversations((prevConversations) => {
            const existingIndex = prevConversations.findIndex(
              (conversation) => conversation.id === data.conversationId,
            );

            if (existingIndex !== -1) {
              // Nếu conversation đã tồn tại, cập nhật thông tin mới nhất
              const updatedConversations = [...prevConversations];
              const existingConversation = {
                ...updatedConversations[existingIndex],
              };

              // Cập nhật thông tin tin nhắn mới nhất
              existingConversation.lastMessage = {
                content: data.content,
                senderId: data.senderId,
              };
              existingConversation.unreadMessages += 1;
              existingConversation.updatedAt = new Date().toISOString();

              // Đưa conversation lên đầu danh sách
              updatedConversations.splice(existingIndex, 1);
              updatedConversations.unshift(existingConversation);

              return updatedConversations;
            } else {
              // Nếu không tìm thấy, thêm conversation mới
              const newConversation: Conversation = {
                id: data.conversationId,
                participants: [
                  {
                    id: data.senderId,
                    username: data.senderUsername,
                    avatarUrl: data.senderAvatarUrl,
                  },
                ], // Danh sách người tham gia
                lastMessage: {
                  content: data.content,
                  senderId: data.senderId,
                },
                unreadMessages: 1,
                updatedAt: new Date().toISOString(),
              };

              return [newConversation, ...prevConversations];
            }
          });

          if (data.conversationId === conversationIdRef.current) {
            setMessages((prevMessages) => [...prevMessages, data]);
          }
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      setIsConnected(false);
      stompClient.deactivate();
    };
  }, []);

  // Hàm xử lý các thông báo
  const handleNotification = (notification: any) => {
    if (notification.type === 'friend-request') {
      toast(
        (props: ToastContentProps) => (
          <FriendRequestNotificationToast
            {...props}
            name={notification.senderName}
            avatarUrl={notification.senderAvatarUrl}
            requestId={notification.requestId}
            senderId={notification.senderId}
          />
        ),
        {
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
        },
      );
    } else if (notification.type === 'comment-post') {
      toast(
        <CommentNotificationToast
          type={notification.type}
          name={notification.senderName}
          avatarUrl={notification.senderAvatarUrl}
          hashtag={notification.hashtag}
          feedId={notification.postId}
          commentContent={notification.commentContent}
        />,
        {
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
        },
      );
    } else if (notification.type === 'comment-challenge') {
      toast(
        <CommentNotificationToast
          type={notification.type}
          name={notification.senderName}
          avatarUrl={notification.senderAvatarUrl}
          hashtag={notification.hashtag}
          feedId={notification.challengeId}
          commentContent={notification.commentContent}
        />,
        {
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
        },
      );
    } else if (notification.type === 'like-post') {
      toast(
        <LikeNotificationToast
          type={notification.type}
          name={notification.senderName}
          avatarUrl={notification.senderAvatarUrl}
          hashtag={notification.hashtag}
          feedId={notification.postId}
        />,
        {
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
        },
      );
    } else if (notification.type === 'like-challenge') {
      toast(
        <LikeNotificationToast
          type={notification.type}
          name={notification.senderName}
          avatarUrl={notification.senderAvatarUrl}
          hashtag={notification.hashtag}
          feedId={notification.challengeId}
        />,
        {
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
        },
      );
    }
  };

  // Hàm để subscribe kênh mới
  const subscribeToChannel = (
    channel: string,
    callback: (data: any) => void,
  ) => {
    if (client && isConnected) {
      return client.subscribe(channel, (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      });
    }
    return null;
  };

  return (
    <WebSocketContext.Provider
      value={{
        client,
        isConnected,
        subscribeToChannel,
        messages,
        setMessages,
        conversations,
        setConversations,
        conversationId,
        setConversationId,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook để sử dụng WebSocket Context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
