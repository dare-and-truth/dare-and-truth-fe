import { FeedProvider } from '@/app/contexts';
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
        <FeedProvider>{children}</FeedProvider>
      </SidebarLayout>
    </div>
  );
}
