'use client';

import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { toast, type ToastContentProps } from 'react-toastify';
import { FriendRequestToast } from '@/components/notificationToast/FriendRequestToast';
var SockJS = require('sockjs-client');

export const useWebSocket = (userId: string, token: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: ` Bearer ${token}`,
      },
      onConnect: () => {
        console.log('WebSocket Connected successfully');
        // Đăng ký nhận thông báo chung
        stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          console.log(notification);
          if (notification.type === 'friend-request') {
            toast(
              (props: ToastContentProps) => (
                <FriendRequestToast
                  {...props}
                  name={notification.senderName}
                  avatarUrl={notification.senderAvatarUrl}
                  requestId={notification.objectId}
                  senderId={notification.senderId}
                />
              ),
              {
                autoClose: 5000,
                closeOnClick: false,
                hideProgressBar: true,
              },
            );
          }
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [userId]);

  return { notifications, client };
};
