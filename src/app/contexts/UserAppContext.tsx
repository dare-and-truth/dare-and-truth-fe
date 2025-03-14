'use client';
import { getUnreadMessagesCount } from '@/app/api/conversation.api';
import { getUnreadNotificationsCount } from '@/app/api/notification.api';
import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

type UserAppContextType = {
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: Dispatch<SetStateAction<number>>;
  unreadMessagesCount: number;
  setUnreadMessagesCount: Dispatch<SetStateAction<number>>;
};

const UserAppContext = createContext<UserAppContextType | undefined>(undefined);

export const UserAppProvider = ({ children }: { children: ReactNode }) => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const fetchUnreadNotificationsAndMessages = async () => {
    try {
      const [notificationCountRes, messageCountRes] = await Promise.all([
        getUnreadNotificationsCount(),
        getUnreadMessagesCount(),
      ]);
      setUnreadNotificationsCount(
        notificationCountRes.totalUnreadNotificationCount,
      );
      setUnreadMessagesCount(messageCountRes.totalUnreadMessagesCount);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  useEffect(() => {
    fetchUnreadNotificationsAndMessages();
  }, []);

  return (
    <UserAppContext.Provider
      value={{
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        unreadMessagesCount,
        setUnreadMessagesCount
      }}
    >
      {children}
    </UserAppContext.Provider>
  );
};

export function useUserApp() {
  const context = useContext(UserAppContext);
  if (context === undefined) {
    throw new Error('useUserApp must be used within a UserAppProvider');
  }
  return context;
}
