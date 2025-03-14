'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLoading } from '@/app/contexts';

export default function NavBar() {
  const [username, setUsername] = useState('');
  const [userAvatarUrl, setUserAvatarUrl] = useState(
    '/images/default-profile.png',
  );
  const { isLoading } = useLoading();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');

    const avatarUrl = localStorage.getItem('avatarUrl');
    if (avatarUrl && avatarUrl.trim() !== 'null' && avatarUrl.trim() !== '') {
      setUserAvatarUrl(avatarUrl);
    } else {
      setUserAvatarUrl('/images/default-profile.png');
    }
  }, [isLoading]);

  return (
    <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between bg-white p-3 shadow-sm md:left-64">
      <div className="ml-auto flex items-center gap-2">
        <span className="text-md max-w-[120px] truncate font-bold text-gray-700 dark:text-gray-200">
          {username}
        </span>
        <Link href="#" className="flex items-center rounded-full">
          <Avatar className="h-10 w-10 object-cover">
            <AvatarImage
              src={userAvatarUrl}
              alt={username}
              onError={(e) =>
                (e.currentTarget.src = '/images/default-profile.png')
              }
              className="object-cover"
            />
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
