'use client';
import {
  acceptFriendRequest,
  createFriendRequest,
  getStatusFriendRequests,
  rejectFriendRequest,
  unFriend,
} from '@/app/api/friends.api';
import { getUserByUserId } from '@/app/api/user.api';
import { StatusFriend, UserProfile } from '@/app/types';
import FriendActionButton from '@/components/FriendActionButton';
import ProgressMonster from '@/components/ProgressMonster';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ProfileHeader({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFriend, setStatusFriend] = useState<StatusFriend>();

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

        if (userId !== currentUser) {
          const status = await getStatusFriendRequests(userId);
          setStatusFriend(status);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      const followerId = localStorage.getItem('userId');

      if (!followerId) {
        console.error('User not logged in');
        return;
      }

      await createFriendRequest({ userId, followerId }, () => {
        setStatusFriend({ typeOfRequest: 'WaitingForAccept', requestId: '' });
        toast('Add friend successfully!');
      });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await unFriend(userId, () => {
        setStatusFriend({ typeOfRequest: 'Stranger', requestId: '' });
        toast('Unfriended successfully!');
      });
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  const handleAccept = async () => {
    try {
      if (!statusFriend?.requestId) {
        console.error('No request ID found');
        return;
      }

      await acceptFriendRequest(statusFriend.requestId, () => {
        setStatusFriend({ typeOfRequest: 'Friend', requestId: '' });
        toast('Friend request accepted!');
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async () => {
    try {
      if (!statusFriend?.requestId) {
        console.error('No request ID found');
        return;
      }

      await rejectFriendRequest(statusFriend.requestId, () => {
        setStatusFriend({ typeOfRequest: 'Stranger', requestId: '' });
        toast('Friend request rejected!');
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const Skeleton = () => (
    <header className="flex flex-col items-center gap-4 p-4">
      <div className="h-16 w-16 animate-pulse rounded-full bg-gray-300 sm:h-20 sm:w-20" />
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
        <div className="mt-2 flex w-1/2 flex-col gap-2">
          <div className="h-8 w-full animate-pulse rounded bg-gray-300" />
          <div className="h-8 w-full animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    </header>
  );

  if (isLoading) return <Skeleton />;

  return (
    <header className="flex flex-col items-center">
      <Image
        alt="profile"
        className="h-16 w-16 rounded-full object-cover sm:h-28 sm:w-28"
        src={user?.avatarUrl || '/images/default-profile.png'}
        width={160}
        height={160}
      />
      <div className="flex w-full flex-col items-center text-center">
        <h2 className="text-lg font-semibold sm:text-xl">{user?.username}</h2>
        <div className="my-2 flex items-center gap-2">
          {isOwnProfile ? (
            <Link
              href="/update-profile"
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Edit Profile
            </Link>
          ) : (
            <>
              <FriendActionButton
                type={statusFriend?.typeOfRequest || 'Stranger'}
                handleAddFriend={handleAddFriend}
                handleAccept={handleAccept}
                handleReject={handleReject}
                handleUnfriend={handleUnfriend}
              />
              <Button variant="join">Chat</Button>
            </>
          )}
        </div>
      </div>
      <ProgressMonster userId={userId} />
    </header>
  );
}
