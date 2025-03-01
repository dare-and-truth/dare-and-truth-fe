'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);
  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-white p-2 dark:bg-zinc-950">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="ml-auto">
        <Link href='/profile'>
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src="/images/default-profile.png" alt={username} />
            <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
