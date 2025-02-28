'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/NavMain';
import { LogoSideBar } from '@/components/LogoSideBar';
import { Logout } from '@/components/NavLogout';
import {
  Home,
  Plus,
  Trophy,
  Bell,
  MessageSquare,
  Users,
  Calendar,
  BarChart2,
  Bookmark,
  UsersRound,
  UserPlus,
} from 'lucide-react';
import { SearchChallengeUser } from '@/components/SearchChallengeUser';

export function MainSideBar({ ...props }) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        icon: <Home size={22} />,
        text: 'Home Page',
        href: '/home',
        active: pathname === '/home',
      },
      {
        icon: <Plus size={22} />,
        text: 'Create Challenge',
        href: '/create-challenge',
        active: pathname === '/create-challenge',
      },
      {
        icon: <Trophy size={22} />,
        text: 'Do Challenge',
        href: '/do-challenge',
        active: pathname === '/do-challenge',
      },
      {
        icon: <Bell size={22} />,
        text: 'Notification',
        href: '/notification',
        active: pathname === '/notification',
        isButton:true
      },
      {
        icon: <MessageSquare size={22} />,
        text: 'Message',
        href: '/message',
        active: pathname === '/message',
      },
      {
        icon: <Users size={22} />,
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
        icon: <Calendar size={22} />,
        text: 'Calendar',
        href: '/calendar',
        active: pathname === '/calendar',
      },
      {
        icon: <BarChart2 size={22} />,
        text: 'Ranking',
        href: '/ranking',
        active: pathname === '/ranking',
      },
      {
        icon: <Bookmark size={22} />,
        text: 'Task',
        href: '/task',
        active: pathname === '/task',
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSideBar />
      </SidebarHeader>
      <SidebarContent>
        <SearchChallengeUser />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Logout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
