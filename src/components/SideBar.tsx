'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // Import useState để quản lý trạng thái mở menu
import { postLogout } from '@/app/api/auth.api';

export default function SideBar({ navItems }: { navItems: NavItemType[] }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<number | null>(null); // Quản lý menu đang mở

  const handleLogout = async () => {
    try {
      await postLogout(router);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.log('Error during logout', error);
    }
  };

  // Hàm xử lý toggle menu
  const handleMenuClick = (index: number) => {
    setOpenMenu(openMenu === index ? null : index); // Nếu menu đang mở thì đóng, ngược lại mở
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
          <div key={index}>
            <NavItem
              icon={item.icon}
              text={item.text}
              href={item.href}
              active={item.active}
              onClick={() => item.subMenu && handleMenuClick(index)} // Nếu có submenu thì toggle khi nhấn vào
            />
            {/* Hiển thị submenu nếu có và menu đang được mở */}
            {item.subMenu && openMenu === index && (
              <SubMenu subMenu={item.subMenu} />
            )}
          </div>
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
  subMenu?: NavItemType[];
  onClick?: () => void;
};

function NavItem({ icon, text, href, active = false, onClick }: NavItemType) {
  return (
    <div>
      <Link
        href={href}
        className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2 transition-colors ${
          active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={onClick} // Thêm onClick cho NavItem
      >
        {icon}
        <span>{text}</span>
      </Link>
    </div>
  );
}

function SubMenu({ subMenu }: { subMenu: NavItemType[] }) {
  return (
    <ul className="pl-6">
      {subMenu.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href}
            className={`flex items-center space-x-2 rounded-lg p-2 transition-colors ${
              item.active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center text-gray-400">
              {item.icon}
            </span>
            <span className="flex-1">{item.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
