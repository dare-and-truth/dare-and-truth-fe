'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';

export function NotificationDropdown({
  icon,
  text,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  // Danh sách thông báo tĩnh (có thể thay bằng API sau)
  const notifications = [
    'New friend request from John',
    'Challenge completed!',
    'Message from Alice',
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          tooltip={text}
          className={active ? 'bg-gray-200 text-base' : 'text-base'}
        >
          <span className="mr-2">{icon}</span>
          <span>{text}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side="right"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <DropdownMenuItem key={index}>{notif}</DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/notification" className="w-full">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
