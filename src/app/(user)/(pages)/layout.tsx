'use client';
import { MobileNav } from '@/components/MobileNav';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';
import {
  BarChart2,
  Bell,
  Bookmark,
  Calendar,
  Home,
  MessageSquare,
  Plus,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const userNavItems = [
    {
      icon: <Home size={20} />,
      text: 'Home Page',
      href: '/home',
      active: pathname === '/home',
    },
    {
      icon: <Plus size={20} />,
      text: 'Create Challenge',
      href: '/create-challenge',
      active: pathname === '/create-challenge',
    },
    {
      icon: <Trophy size={20} />,
      text: 'Do Challenge',
      href: '/do-challenge',
      active: pathname === '/do-challenge',
    },
    {
      icon: <Bell size={20} />,
      text: 'Notification',
      href: '/notification',
      active: pathname === '/notification',
    },
    {
      icon: <MessageSquare size={20} />,
      text: 'Message',
      href: '/message',
      active: pathname === '/message',
    },
    {
      icon: <Users size={20} />,
      text: 'Friends',
      href: '/friends',
      active: pathname.startsWith('/friends'),
      subMenu: [
        {
          icon: <UsersRound size={18} className="text-blue-500" />,
          text: 'All Friends',
          href: '/friends/all-friends',  
          active: pathname === '/friends/all-friends',
        },
        {
          icon: <UserPlus size={18} className="text-green-500" />,
          text: 'Friend Requests',
          href: '/friends/add-friends',  
          active: pathname === '/friends/add-friends',
        },
      ],
    },
    {
      icon: <Calendar size={20} />,
      text: 'Calendar',
      href: '/calendar',
      active: pathname === '/calendar',
    },
    {
      icon: <BarChart2 size={20} />,
      text: 'Ranking',
      href: '/ranking',
      active: pathname === '/ranking',
    },
    {
      icon: <Bookmark size={20} />,
      text: 'Task',
      href: '/task',
      active: pathname === '/task',
    },
  ];
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar navItems={userNavItems} />
      <div className="min-h-full flex-1 md:ml-64">
        <Header />
        {children}
        <MobileNav />
      </div>
    </div>
  );
}
