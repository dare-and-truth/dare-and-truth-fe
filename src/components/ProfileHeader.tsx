'use client';
import {
  acceptFriendRequest,
  createFriendRequest,
  getStatusFriendRequests,
  rejectFriendRequest,
  unFriend,
} from '@/app/api/friends.api';
import { getUserByUserId, updateUser } from '@/app/api/user.api';
import { StatusFriend, User, UserProfile } from '@/app/types';
import FriendActionButton from '@/components/FriendActionButton';
import ProgressMonster from '@/components/ProgressMonster';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UpdateUserPopup } from './UpdateUserPopup';
import { useLoading } from '@/app/contexts';

export default function ProfileHeader({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const [statusFriend, setStatusFriend] = useState<StatusFriend>();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  // const { loading, setLoading } = useLoading();
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
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

  const handleUpdateUser = async (updatedUser: {
    avatarUrl: string;
    username: string;
    email?: string;
  }) => {
    setIsLoading(true);
    if (!user) return;

    try {
      const updatedData: Partial<UserProfile> = {
        username: updatedUser.username || user.username,
        email: updatedUser.email ?? user.email ?? '',
        avatarUrl: updatedUser.avatarUrl ?? user.avatarUrl ?? '',
      };

      await updateUser(updatedData as User, user.id);

      setUser((prev) => {
        if (!prev) return null;
        return { ...prev, ...updatedData };
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      const followerId = localStorage.getItem('userId');

      if (!followerId) {
        console.error('User not logged in');
        return;
      }

      await createFriendRequest({ userId, followerId }, () => {
        setStatusFriend({ typeOfRequest: 'WaitingForAccept', requestId: '' });
        toast.success('Add friend successfully!');
      });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await unFriend(userId, () => {
        setStatusFriend({ typeOfRequest: 'Stranger', requestId: '' });
        toast.success('Unfriended successfully!');
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
        toast.success('Friend request accepted!');
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
        toast.success('Friend request rejected!');
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
        className="h-16 w-16 rounded-full border-2 border-red-300 object-cover sm:h-28 sm:w-28"
        src={
          user?.avatarUrl
            ? user.avatarUrl.trim()
            : '/images/default-profile.png'
        }
        width={160}
        height={160}
      />
      <div className="flex w-full flex-col items-center text-center">
        <h2 className="text-lg font-semibold sm:text-xl">{user?.username}</h2>
        <div className="my-2 flex items-center gap-2">
          {isOwnProfile ? (
            <Button onClick={() => setIsEditPopupOpen(true)} variant="join">
              Edit Profile
            </Button>
          ) : (
            <>
              <FriendActionButton
                type={statusFriend?.typeOfRequest || 'Stranger'}
                handleAddFriend={handleAddFriend}
                handleAccept={handleAccept}
                handleReject={handleReject}
                handleUnfriend={handleUnfriend}
              />
              <Link href={`/message?userId=${userId}`}>
                <Button variant="join">Chat</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {user && (
        <UpdateUserPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          user={{
            avatarUrl: user.avatarUrl || '',
            username: user.username,
            email: user.email || '',
          }}
          onUpdate={handleUpdateUser}
        />
      )}
      <ProgressMonster userId={userId} />
    </header>
  );
}
