'use client';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import { Badge, Command, FileText, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const adminNavItems = [
    {
      icon: <Users size={20} />,
      text: 'Manage Users',
      href: '/dashboard/user',
      active: pathname === '/dashboard/user',
    },
    {
      icon: <FileText size={20} />,
      text: 'Manage Posts',
      href: '/dashboard/post',
      active: pathname === '/dashboard/post',
    },
    {
      icon: <Command size={20} />,
      text: 'Manage Comments',
      href: '/dashboard/comment',
      active: pathname === '/dashboard/comment',
    },
    {
      icon: <Badge size={20} />,
      text: 'Manage Badges',
      href: '/dashboard/badge',
      active: pathname === '/dashboard/manage',
    },
  ];
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar navItems={adminNavItems} />
      <div className="flex-1 md:ml-64">
        <Header />
        {children}
      </div>
    </div>
  );
}
