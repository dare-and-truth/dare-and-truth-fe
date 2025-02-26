'use client';

import { useEffect, useState } from 'react';
import { getAllFriendsList } from '@/app/api/friends.api'; // Gọi đúng API lấy danh sách bạn
import FriendRequestCard from '@/components/FriendsRequestCard';
import { FriendList } from '@/app/types';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

export default function ListFriendPage() {
  const [friends, setFriends] = useState<FriendList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const data = await getAllFriendsList();
        setFriends(data);
      } catch (error) {
        console.error('Failed to fetch friends list', error);
        toast.error('Failed to fetch friends list');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleUnfriend = (requestId: string) => {
    setFriends((current) =>
      current.filter((friend) => friend.id !== requestId),
    );
  };
  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      {loading ? (
        <Loading />
      ) : friends.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">Currently no friends.</p>
      ) : (
        <div className="flex flex-col items-center">
          {friends.map((friend) => (
            <FriendRequestCard
              key={friend.id}
              avatar={'/images/default-profile.png'}
              username={friend.follower.username}
              isAccepted={friend.isAccepted}
              acceptedAt={friend.acceptedAt}
              requestId={friend.id}
              followerId={friend.follower.id}
              userId={friend.user.id}
              followedAt={friend.followedAt}
              onUnfriend={handleUnfriend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
