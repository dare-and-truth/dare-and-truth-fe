import { MobileNav } from '@/app/components/MobileNav';
import SideBar from '@/app/components/SideBar';
import Header from '@/app/components/Header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
