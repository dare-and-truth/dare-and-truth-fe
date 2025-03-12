'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLoading } from '@/app/contexts';
import Image from 'next/image';

export default function NavBar() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userAvatarUrl, setUserAvatarUrl] = useState(
    '/images/default-profile.png',
  );
  const { isLoading } = useLoading();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
    setUserId(localStorage.getItem('userId') || '');

    const avatarUrl = localStorage.getItem('avatarUrl');
    if (avatarUrl && avatarUrl.trim() !== 'null' && avatarUrl.trim() !== '') {
      setUserAvatarUrl(avatarUrl);
    } else {
      setUserAvatarUrl('/images/default-profile.png');
    }
  }, [isLoading]);

  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-white p-2 dark:bg-zinc-950">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="ml-auto flex items-center gap-2">
        <span className="text-md max-w-[120px] truncate font-bold text-gray-700 dark:text-gray-200">
          {username}
        </span>
        <Link
          href={`/profile/${userId}`}
          className="flex items-center rounded-full"
        >
          <Image
            alt="profile"
            className="rounded-full object-cover sm:h-14 sm:w-14"
            src={
              userAvatarUrl
                ? userAvatarUrl.trim()
                : '/images/default-profile.png'
            }
            width={100}
            height={100}
          />
        </Link>
      </div>
    </header>
  );
}
