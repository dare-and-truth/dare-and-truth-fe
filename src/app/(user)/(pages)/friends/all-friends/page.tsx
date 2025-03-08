// app/list-friend/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllFriendsList } from '@/app/api/friends.api';
import FriendRequestCard from '@/components/FriendsRequestCard';
import { FriendList } from '@/app/types';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

export default function ListFriendPage() {
  const [friends, setFriends] = useState<FriendList[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId'); // Lấy userId từ localStorage

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const data = await getAllFriendsList();
        // Không cần lọc, giữ nguyên tất cả bạn bè đã chấp nhận
        setFriends(data);
      } catch (error) {
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
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      {loading ? (
        <Loading />
      ) : friends.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">Currently no friends.</p>
      ) : (
        <div className="flex flex-col items-center">
          {friends.map((friend) => (
            <FriendRequestCard
              key={friend.id}
              mode="friends" // Sử dụng chế độ 'friends'
              avatar={'/images/default-profile.png'}
              // Kiểm tra followerId so với currentUserId để chọn username
              username={
                currentUserId && friend.follower.id === currentUserId
                  ? friend.user.username
                  : friend.follower.username
              }
              isAccepted={friend.isAccepted}
              acceptedAt={friend.acceptedAt}
              followedAt={friend.followedAt}
              requestId={friend.id}
              followerId={friend.follower.id}
              userId={friend.user.id}
              onUnfriend={handleUnfriend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
