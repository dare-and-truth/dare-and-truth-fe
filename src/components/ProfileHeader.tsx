'use client';
import { getUserByUserId } from '@/app/api/user.api';
import ProgressMonster from '@/components/ProgressMonster';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  isActive?: string;
  username: string;
  email?: string;
  avatarUrl: null | string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
}

export default function ProfileHeader({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = localStorage.getItem('userId');
        const response = await getUserByUserId(userId);
        if (response) {
          setUser(response);
          setIsOwnProfile(response.id === currentUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Skeleton component
  const Skeleton = () => (
    <header className="flex animate-pulse flex-wrap items-center p-4 md:py-8">
      <div className="md:ml-16 md:w-3/12">
        <div className="h-20 w-20 rounded-full bg-gray-300 md:h-40 md:w-40" />
      </div>
      <div className="ml-4 w-8/12 md:w-7/12">
        <div className="mb-4 md:flex md:flex-wrap md:items-center">
          <div className="mb-2 h-8 w-40 rounded bg-gray-300 sm:mb-0 md:mr-2" />
          <div className="h-8 w-24 rounded bg-gray-300" />
        </div>
      </div>
    </header>
  );

  if (isLoading) return <Skeleton />;

  return (
    <header className="flex flex-wrap items-center p-4 md:py-8">
      <div className="md:ml-16 md:w-3/12">
        <Image
          alt="profile"
          className="h-20 w-20 rounded-full object-cover p-1 md:h-40 md:w-40"
          src={user?.avatarUrl || '/images/default-profile.png'}
          width={160}
          height={160}
        />
      </div>
      <div className="ml-4 w-8/12 md:w-7/12">
        <div className="md:flex md:flex-wrap md:items-center">
          <h2 className="inline-block text-xl font-light sm:mb-0 md:mr-2">
            {user?.username}
          </h2>
          {isOwnProfile ? (
            <Link
              href="/update-profile"
              className="block rounded bg-blue-500 px-2 py-1 text-center text-sm font-semibold text-white sm:inline-block"
            >
              Edit Profile
            </Link>
          ) : (
            <Button className="block rounded bg-blue-500 px-2 py-1 text-center text-sm font-semibold text-white sm:inline-block">
              Add Friend
            </Button>
          )}
        </div>
        <div className="mb-4 md:flex md:flex-wrap md:items-center"></div>
        <ProgressMonster userId={userId} />
      </div>
    </header>
  );
}
