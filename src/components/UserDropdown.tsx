'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogIn, UserPlus } from 'lucide-react';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=""
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src="/images/default-profile.png"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full transition-all"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg">
            <a
              href="/login"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </a>
            <a
              href="/register"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </a>
          </div>
        </>
      )}
    </div>
  );
}
