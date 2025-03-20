import { firebaseConfig } from '@/app/constants';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission(); // 🔹 Hỏi quyền từ trình duyệt

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
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default messaging;
