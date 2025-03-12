// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  getChallengeBySearchChallenge,
  getUserBySearchUser,
} from '@/app/api/search.api';
import { FeedType, UserWithRequestsResponse } from '@/app/types';
import Feed from '@/components/Feed';
import FriendRequestCard from '@/components/FriendsRequestCard';
import { useLoading } from '@/app/contexts';
import Loading from '@/components/Loading';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('challenges');
  const [feeds, setFeeds] = useState<FeedType[]>([]);
  const [users, setUsers] = useState<UserWithRequestsResponse[]>([]);
  const { setIsLoading, isLoading } = useLoading();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    setCurrentUserId(currentUserId);
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        if (activeTab === 'challenges') {
          const response = await getChallengeBySearchChallenge(query);
          setFeeds(response);
        } else {
          const response = await getUserBySearchUser(query);
          // Lọc các user khác với user hiện tại, nhưng giữ lại các request liên quan đến currentUserId
          const filteredUsers = response.filter(
            (user: UserWithRequestsResponse) => {
              const hasRequestForCurrentUser = user.requests.some(
                (request) =>
                  request.user.id === currentUserId && !request.isAccepted,
              );
              return user.user.id !== currentUserId || hasRequestForCurrentUser;
            },
          );
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [query, activeTab]);

  const handleAddFriend = (userId: string, followerId: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.user.id === userId
          ? {
              ...user,
              requests: [
                ...(user.requests || []),
                {
                  id: crypto.randomUUID(), // Tạo tạm ID cho request mới
                  followedAt: new Date().toISOString(),
                  acceptedAt: undefined,
                  user: { 
                    id: userId, 
                    username: user.user.username, 
                    avatarUrl: user.user.avatarUrl // Thêm avatarUrl vào đây
                  },
                  isAccepted: false,
                  follower: {
                    id: followerId,
                    username: localStorage.getItem('username') || '',
                    avatarUrl: localStorage.getItem('avatarUrl') || '' // Đảm bảo follower cũng có avatarUrl
                  },
                },
              ],
            }
          : user,
      ),
    );
  };  

  const handleUnfriend = (requestId: string) => {
    setUsers((current) =>
      current.map((user) => ({
        ...user,
        requests: user.requests.filter((r) => r.id !== requestId),
      })),
    );
  };

  const handleAccept = (requestId: string) => {
    setUsers((current) =>
      current.map((user) => ({
        ...user,
        requests: user.requests.map((r) =>
          r.id === requestId ? { ...r, isAccepted: true } : r,
        ),
      })),
    );
  };

  const handleReject = (requestId: string) => {
    setUsers((current) =>
      current.map((user) => ({
        ...user,
        requests: user.requests.filter((r) => r.id !== requestId),
      })),
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 pb-20 md:pb-4">
      <div className="mx-auto max-w-2xl p-4">
        <Tabs
          defaultValue="challenges"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            {isLoading ? (
              <Loading />
            ) : feeds.length === 0 ? (
              <p className="mt-4 text-center text-gray-500">
                No challenges found.
              </p>
            ) : (
              feeds.map((feed) => <Feed feed={feed} key={feed.id} />)
            )}
          </TabsContent>

          <TabsContent value="users">
            {isLoading ? (
              <Loading />
            ) : users.length === 0 ? (
              <p className="mt-4 text-center text-gray-500">No users found.</p>
            ) : (
              users.map((user) => (
                <FriendRequestCard
                  key={user.user.id}
                  mode="search"
                  avatar={user.user.avatarUrl}
                  username={user.user.username}
                  followedAt={user.requests[0]?.followedAt || ''}
                  isAccepted={user.requests[0]?.isAccepted || false}
                  acceptedAt={user.requests[0]?.acceptedAt || undefined}
                  requestId={user.requests[0]?.id || ''}
                  followerId={user.requests[0]?.follower.id || ''}
                  userId={user.requests[0]?.user.id || user.user.id}
                  width="w-[100%]"
                  onAccept={(requestId) => handleAccept(requestId)}
                  onReject={(requestId) => handleReject(requestId)}
                  onUnfriend={(requestId) => handleUnfriend(requestId)}
                  onAddFriend={(userId, followerId) =>
                    handleAddFriend(userId, followerId)
                  }
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
