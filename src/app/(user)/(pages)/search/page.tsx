'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  getChallengeBySearchChallenge,
  getUserBySearchUser,
} from '@/app/api/search.api';
import { FeedType, User } from '@/app/types';
import Feed from '@/components/Feed';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('challenges');
  const [feeds, setFeeds] = useState<FeedType []>([]);
  const [users, setUsers] = useState<User []>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'challenges') {
          const response = await getChallengeBySearchChallenge(query);
          setFeeds(response);
        } else {
          const response = await getUserBySearchUser(query);
          setUsers(response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, activeTab]);

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
            {feeds.map((feed) => (
              <Feed feed={feed} key={feed.id} />
            ))}
          </TabsContent>

          
          <TabsContent value="users">
            {users.map((item) => (
              <li key={item.id}>{item.username}</li>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
