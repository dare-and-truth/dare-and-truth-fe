'use client';

import { FeedProvider } from '@/app/contexts';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import NavBar from '@/components/NavBar';
import SidebarLayout from '@/components/SideBarLayout';
import { useEffect, useState } from 'react';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('accessToken');
    setUserId(storedUserId);
    setToken(storedToken);
  }, []);

  const { notifications } = useWebSocket(userId as string, token as string);

  return (
    <div>
      <SidebarLayout>
        <NavBar />
        <FeedProvider>{children}</FeedProvider>
      </SidebarLayout>
    </div>
  );
}
