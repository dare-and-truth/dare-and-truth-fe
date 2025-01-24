import { MobileNav } from '@/components/MobileNav';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';
import HomePage from '@/app/(user)/(pages)/home/page';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar />
      <div className="flex-1 md:ml-64">
        <Header />
        {children}
        <MobileNav />
      </div>
    </div>
  );
}
