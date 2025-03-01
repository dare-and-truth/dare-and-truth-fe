'use client';
import { useCallback, useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Feed from '@/components/Feed';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITEMS_PER_PAGE } from '@/app/constants';
import { getFeeds } from '@/app/api/feed.api';
import { useFeedContext } from '@/app/contexts';
import Loading from '@/components/Loading';
import EndOfFeed from '@/components/EndOfFeed';

export default function HomePage() {
  const { feeds, setFeeds, page, setPage, hasMore, setHasMore } =
    useFeedContext();
  const [loading, setLoading] = useState(false);

  const fetchChallenges = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const newFeeds = await getFeeds(page, ITEMS_PER_PAGE);

      if (newFeeds && newFeeds.length > 0) {
        setFeeds((prev) => [
          ...prev,
          ...newFeeds.sort(() => 0.5 - Math.random()),
        ]);
        if (newFeeds.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, page, setFeeds, setHasMore, setPage]);

  useEffect(() => {
    if (feeds.length === 0) {
      fetchChallenges();
    }
  }, [feeds]);

  const refreshFeed = () => {
    setFeeds([]); // Clear existing feeds
    setPage(0);
    setHasMore(true);
  };

  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4"
      id="scrollableDiv"
    >
      <div className="mx-auto max-w-2xl p-4">
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchChallenges}
          hasMore={hasMore}
          loader={<Loading />}
          endMessage={
            <EndOfFeed refreshFeed={refreshFeed} />
          }
          scrollableTarget="scrollableDiv"
        >
          {feeds.map((feed: FeedType) => (
            <Feed feed={feed} key={feed.id} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
