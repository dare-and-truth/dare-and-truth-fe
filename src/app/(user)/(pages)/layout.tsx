import { FeedProvider, WebSocketProvider } from '@/app/contexts';
import { UserAppProvider } from '@/app/contexts/UserAppContext';
import NavBar from '@/components/NavBar';
import SidebarLayout from '@/components/SideBarLayout';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserAppProvider>
        <SidebarLayout>
          <NavBar />
          <WebSocketProvider>
            <FeedProvider>{children}</FeedProvider>
          </WebSocketProvider>
        </SidebarLayout>
      </UserAppProvider>
    </>
  );
}
