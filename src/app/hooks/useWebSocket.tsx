'use client';

import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { toast, type ToastContentProps } from 'react-toastify';
import { FriendRequestNotificationToast } from '@/components/notificationToast/FriendRequestNotificationToast';
import { CommentNotificationToast } from '@/components/notificationToast/CommentNotificationToast';
import { LikeNotificationToast } from '@/components/notificationToast/LikeNotificationToast';
var SockJS = require('sockjs-client');

export const useWebSocket = (userId: string, token: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/ws`);
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
