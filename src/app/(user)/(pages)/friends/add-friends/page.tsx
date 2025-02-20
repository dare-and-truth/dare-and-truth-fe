'use client';

import { useEffect, useState } from 'react';
import { getAllFriendRequests} from '@/app/api/friends.api';
import FriendRequestCard from "@/components/FriendsRequestCard";
import { FriendRequest } from '@/app/types';
import { toast } from 'react-toastify';

export default function AddFriendRequestsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const localUserId = localStorage.getItem('userId') as string;

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!localUserId) return;
      setLoading(true);
      try {
        const data = await getAllFriendRequests();   
        const requests = data.filter((request: FriendRequest) => request.user.id === localUserId && !request.isAccepted);
        setFriendRequests(requests);
      } catch (error) {
        console.error('Failed to fetch list friend requests', error);
        toast.error("Failed to fetch list friend requests");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [localUserId]);


  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center">
          {friendRequests.map((request: any) => (
            <FriendRequestCard
              key={request.id}
              avatar={'/images/default-profile.png'}
              username={request.follower.username}
              followAt={request.followedAt}
              isAccepted={false}
              requestId={request.id}
              userId={localUserId}
            />          
          ))}
        </div>
      )}
    </div>
  );
}
