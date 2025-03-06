// context/WebSocketContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Client } from '@stomp/stompjs';
import { toast, type ToastContentProps } from 'react-toastify';
import { FriendRequestNotificationToast } from '@/components/notificationToast/FriendRequestNotificationToast';
import { CommentNotificationToast } from '@/components/notificationToast/CommentNotificationToast';
import { LikeNotificationToast } from '@/components/notificationToast/LikeNotificationToast';
var SockJS = require('sockjs-client');

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
  subscribeToChannel: (channel: string, callback: (data: any) => void) => any;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: ` Bearer ${token}`,
      },
      onConnect: () => {
        console.log('WebSocket Connected successfully');
        setIsConnected(true);

        // Đăng ký nhận thông báo chung
        stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          handleNotification(notification);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      setIsConnected(false);
      stompClient.deactivate();
    };
  }, [userId, token]);

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
      value={{ client, isConnected, subscribeToChannel }}
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
