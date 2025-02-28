'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export function NotificationDropdown({
  icon,
  text,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
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
    </DropdownMenu>
  );
}
