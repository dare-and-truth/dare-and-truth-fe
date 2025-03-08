'use client';
import { getFeedById } from '@/app/api/feed.api';
import { FeedType } from '@/app/types';
import Feed from '@/components/Feed';
import Loading from '@/components/Loading';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostDetailPage() {
  const params = useParams<{ type: string; feedId: string }>();
  const [feed, setFeed] = useState<FeedType | null>(null);
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getFeedById(params.feedId, params.type);
        setFeed(response);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchFeed();
  }, [params.type, params.feedId]);
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="mx-auto max-w-2xl p-4">
        {!feed && <Loading />}
        {feed && <Feed feed={feed} />}
      </div>
    </div>
  );
}
