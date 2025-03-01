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
            <div className="flex  bg-gray-200 size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Image
                src='/images/logo.png'
                alt="Logo"
                width={80}
                height={32}
                className="h-10 w-10" 
              />
            </div>
            <div className="ml-2 grid flex-1 text-left text-md leading-tight">
              <span className="truncate font-semibold">Do Do</span>
              <span className="truncate ">Welcome back</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
