import { MobileNav } from '@/app/components/MobileNav';
import SideBar from '@/app/components/SideBar';
import Header from '@/app/components/Header';
import HomePage from '@/app/(user)/home/page';

export default function UserLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar />
      <div className="flex-1 md:ml-64">
        <Header />
        <HomePage />
        <MobileNav />
      </div>
    </div>
  );
}
