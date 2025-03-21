'use client';

import { firebaseConfig } from '@/app/constants';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

let messaging: any = null;

if (typeof window !== 'undefined') {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestPermission = async () => {
  if (typeof window === 'undefined') return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permission denied for notifications');
      return null;
    }
    const token = await getToken(messaging, {
      vapidKey:
        'BOHGLPcFntLrO6u7ElneXMj68PyHlmYP5XAZrZdAtW7lqKYnAUvHfPV9-HcbqyabKVJcv94Hmpyjc3m4m___x6U',
    });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } else {
      resolve(null);
    }
  });

export default messaging;
