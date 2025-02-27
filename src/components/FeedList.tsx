// components/FeedList.tsx
'use client';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Feed from '@/components/Feed';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITEMS_PER_PAGE } from '@/app/constants';
import { getFeeds } from '@/app/api/feed.api';
import { useFeedContext } from '@/app/contexts/FeedContext';
import Loading from '@/components/Loading';

export default function FeedList() {
  const { feeds, setFeeds, page, setPage, hasMore, setHasMore } =
    useFeedContext();
  const [loading, setLoading] = useState(false);

  const fetchChallenges = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const newFeeds = await getFeeds(page, ITEMS_PER_PAGE);

      if (newFeeds && newFeeds.length > 0) {
        setFeeds((prev) => [...prev, ...newFeeds]);
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
    fetchChallenges();
  }, []);

  return (
    <div
      className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4"
      id="scrollableDiv"
    >
      <div className="mx-auto max-w-2xl p-4">
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchChallenges}
          hasMore={hasMore}
          loader={<Loading />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
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
