'use client';

import { Home, Search, PlayCircle, Bell, User } from 'lucide-react';
import Link from 'next/link';

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        <NavLink href="/" icon={<Home size={24} />} />
        <NavLink href="/search" icon={<Search size={24} />} />
        <NavLink
          href="/play"
          icon={<PlayCircle size={24} className="text-blue-600" />}
        />
        <NavLink href="/notifications" icon={<Bell size={24} />} />
        <NavLink href="/profile" icon={<User size={24} />} />
      </div>
    </nav>
  );
}

function NavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="p-2">
      {icon}
    </Link>
  );
}
