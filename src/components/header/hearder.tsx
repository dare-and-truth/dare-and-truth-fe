'use client';

import Link from 'next/link';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { useUserStore } from '@/lib/stores/user-stores';


interface HeaderProps {
  page: string;
}

export function Header({ page }: HeaderProps) {
  const { userDetails } = useUserStore();

  return (
    <header className="sticky top-0 z-10 flex h-[60px] w-full items-center justify-between border-b border-stone-300 bg-white px-4 dark:border-stone-700 dark:bg-[#1c1c1c]">
      <Link href="/" className="text-xl font-semibold">
        Instagram
      </Link>

      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <Link href="/" aria-label="Home">
              <Home className={page === 'Home' ? 'fill-current' : ''} />
            </Link>
          </li>
          <li>
            <Link href="/explore" aria-label="Search">
              <Search />
            </Link>
          </li>
          <li>
            <Link href="/create" aria-label="Create post">
              <PlusSquare />
            </Link>
          </li>
          <li>
            <Link
              href="/inbox"
              aria-label="Messages"
              className={page === 'Inbox' ? 'font-bold' : ''}
            >
              <Heart className={page === 'Inbox' ? 'fill-current' : ''} />
            </Link>
          </li>
          <li>
            <Link href={`/${userDetails.displayName}`} aria-label="Profile">
              <User className={page === 'Profile' ? 'fill-current' : ''} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
