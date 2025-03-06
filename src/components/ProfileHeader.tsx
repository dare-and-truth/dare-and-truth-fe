'use client';
import { getUserByUserId } from '@/app/api/user.api';
import ProgressMonster from '@/components/ProgressMonster';
import { Check, Link } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  isActive?: string;
  username: string;
  email?: string;
  avatarUrl: null;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
}
export default function ProfileHeader({ userId }: { userId: string }) {
  const [user, setUser] = useState<User>();
  const [hideButton, setHideButton] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByUserId(userId);
        if (response) {
          setUser(response);
          setHideButton(response.id === userId);
        }
      } catch (error) {}
    };
    fetchUser();
  }, [userId]);
  return (
    <header className="flex flex-wrap items-center p-4 md:py-8">
      <div className="md:ml-16 md:w-3/12">
        <Image
          alt="profile"
          className="h-18 w-18 rounded-full object-cover p-1 md:h-32 md:w-32"
          src={user?.avatarUrl ? user.avatarUrl : '/images/default-profile.png'}
          width={160}
          height={160}
        />
      </div>

      <div className="ml-4 w-8/12 md:w-7/12">
        <div className="mb-4 md:flex md:flex-wrap md:items-center">
          <h2 className="mb-2 inline-block text-xl font-light sm:mb-0 md:mr-2">
            {user?.username}
          </h2>
          <span className="relative mr-6 inline-block -translate-y-2 transform text-xl text-blue-500">
            <Check className="absolute inset-x-0 ml-1 mt-1 h-5 w-5 text-white" />
          </span>
          {hideButton ? (
            <Link
              href="/update-profile"
              className="block rounded bg-blue-500 px-2 py-1 text-center text-sm font-semibold text-white sm:inline-block"
            >
              Edit Profile
            </Link>
          ) : null}
        </div>
        <ProgressMonster />
      </div>
    </header>
  );
}
