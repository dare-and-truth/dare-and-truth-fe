'use client';
import {
  BarChart2,
  Bell,
  Bookmark,
  Calendar,
  Home,
  LogOut,
  MessageSquare,
  Plus,
  Trophy,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const pathname = usePathname(); 

  const navItems = [
    { icon: <Home size={20} />, text: 'Home Page', href: '/home' },
    { icon: <Plus size={20} />, text: 'Create Challenge', href: '/create-challenge' },
    { icon: <Trophy size={20} />, text: 'Do Challenge', href: '/do-challenge' },
    { icon: <Bell size={20} />, text: 'Notification', href: '/notification' },
    { icon: <MessageSquare size={20} />, text: 'Message', href: '/message' },
    { icon: <Users size={20} />, text: 'Friends', href: '/friends' },
    { icon: <Calendar size={20} />, text: 'Calendar', href: '/calendar' },
    { icon: <BarChart2 size={20} />, text: 'Ranking', href: '/ranking' },
    { icon: <Bookmark size={20} />, text: 'Task', href: '/task' },
  ];

  return (
    <div className="fixed h-full w-64 flex-col bg-white p-4 shadow-sm sm:hidden md:flex">
      <div className="mb-4">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={40}
          className="w-24"
        />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            text={item.text}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </nav>
      <button className="mt-auto flex items-center space-x-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">
        <LogOut size={20} />
        <span>Log out</span>
      </button>
    </div>
  );
}

function NavItem({
  icon,
  text,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
}) {
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
