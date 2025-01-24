'use client';

import { useState } from 'react';
import { Trophy, Calendar, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center text-blue-600"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-2 top-14 z-50 min-w-[200px] rounded-lg bg-white py-2 shadow-lg">
            <MenuItem
              href="/challenge/create"
              icon={<Trophy size={20} />}
              text="Do Challenge"
            />
            <MenuItem
              href="/ranking"
              icon={<BarChart2 size={20} />}
              text="Ranking"
            />
            <MenuItem
              href="/calendar"
              icon={<Calendar size={20} />}
              text="Calendar"
            />
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
