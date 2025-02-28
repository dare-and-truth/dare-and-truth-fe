'use client';

import { LogOut } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { postLogout } from '@/app/api/auth.api';
import { useRouter } from 'next/navigation';

export function Logout() {
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
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleLogout}
          className="mr-2 mt-auto flex items-center space-x-1"
        >
          <span className="mr-2">
            <LogOut size={22} />
          </span>

          <span className="text-base">Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
