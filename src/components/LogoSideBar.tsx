'use client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

export function LogoSideBar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Link href="/home" className="flex items-center">
            <Image
              src="/images/old-logo.png"
              alt="Logo"
              width={0}
              height={0}
              className="h-20 w-20 object-contain"
            />
            <div className="text-md grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold">Do Do</span>
              <span className="truncate">Welcome back</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
