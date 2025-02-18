'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { postLogout } from '@/app/api/auth.api';

export default function SideBar({ navItems }: { navItems: NavItemType[] }) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await postLogout(router);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.log('Error during logout', error);
    }
  };
  return (
    <div className="fixed h-full w-64 flex-col bg-white shadow-sm sm:hidden md:flex">
      <div className="mb-4">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={40}
          className="w-28"
        />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            text={item.text}
            href={item.href}
            active={item.active}
          />
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        <LogOut size={20} />
        <span>Log out</span>
      </button>
    </div>
  );
}

type NavItemType = {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
};

function NavItem({ icon, text, href, active = false }: NavItemType) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
