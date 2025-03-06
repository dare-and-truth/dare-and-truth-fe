import { FeedProvider, WebSocketProvider } from '@/app/contexts';
import NavBar from '@/components/NavBar';
import SidebarLayout from '@/components/SideBarLayout';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarLayout>
        <NavBar />
        <WebSocketProvider>
          <FeedProvider>{children}</FeedProvider>
        </WebSocketProvider>
      </SidebarLayout>
    </div>
  );
}
