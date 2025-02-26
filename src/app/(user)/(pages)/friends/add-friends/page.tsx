'use client';

import { useEffect, useState } from 'react';
import { getAllFriendRequests } from '@/app/api/friends.api';
import FriendRequestCard from '@/components/FriendsRequestCard';
import { FriendRequest } from '@/app/types';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

export default function AddFriendRequestsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      try {
        const data = await getAllFriendRequests();   
        setFriendRequests(data);
      } catch (error) {
        console.error('Failed to fetch friend requests', error);
        toast.error('Failed to fetch friend requests');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = (requestId: string) => {
    setFriendRequests(current => current.filter(request => request.id !== requestId));
  };
  
  const handleReject = (requestId: string) => {
    setFriendRequests(current => current.filter(request => request.id !== requestId));
  };

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      {loading ? (
        <Loading />
      ) : friendRequests.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">Currently no friend requests.</p>
      ) : (
        <div className="flex flex-col items-center">
          {friendRequests.map((request) => (
            <FriendRequestCard
              key={request.id}
              avatar={'/images/default-profile.png'}
              username={request.follower.username}
              followedAt={request.followedAt}
              isAccepted={request.isAccepted}
              requestId={request.id}
              followerId={request.follower.id}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
