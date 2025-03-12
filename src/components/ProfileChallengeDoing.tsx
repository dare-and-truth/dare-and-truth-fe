'use client';
import { Bolt, Grid } from 'lucide-react';
import { act, useCallback, useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Feed from '@/components/Feed';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITEMS_PER_PAGE } from '@/app/constants';
import { useFeedContext } from '@/app/contexts';
import Loading from '@/components/Loading';
import EndOfFeed from '@/components/EndOfFeed';
import { getChallengeByUserId } from '@/app/api/challenge.api';
import { getPostByUserId } from '@/app/api/post.api';
export default function ProfileChallengeDoing({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState(
    'challenges'
  );
  const { feeds, setFeeds, page, setPage, hasMore, setHasMore } =
    useFeedContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset feeds khi vào Profile lần đầu tiên
    setFeeds([]);
    setPage(0);
    setHasMore(true);
  }, []);

  const fetchChallenges = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const fetchFunc =
        activeTab === 'challenges' ? getChallengeByUserId : getPostByUserId;
      const response = await fetchFunc(userId, page, ITEMS_PER_PAGE);
      if (response && response.length > 0) {
        setFeeds((prev) => [...prev, ...response]);
        if (response.length < ITEMS_PER_PAGE) {
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
  }, [loading, page, setFeeds, setHasMore, setPage, activeTab]);

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
    <div className="mt-4 md:px-3">
      <ul className="flex items-center justify-around space-x-12 border-t text-xs font-semibold uppercase tracking-widest text-gray-600 md:justify-center">
        <li
          className={`md:-mt-px md:border-t ${
            activeTab === 'challenges'
              ? 'md:border-gray-700 md:text-gray-700'
              : ''
          }`}
        >
          <button
            className="flex items-center p-3"
            onClick={() => {
              setActiveTab('challenges');
              setFeeds([]);
              setPage(0);
              setHasMore(true);
            }}
          >
            <Bolt className="mr-1 h-5 w-5 md:h-4 md:w-4" />
            <span className="text-black">Challenges</span>
          </button>
        </li>
        <li
          className={`md:-mt-px md:border-t ${
            activeTab === 'posts' ? 'md:border-gray-700 md:text-gray-700' : ''
          }`}
        >
          <button
            className="flex items-center p-3"
            onClick={() => {
              setActiveTab('posts');
              setFeeds([]);
              setPage(0);
              setHasMore(true);
            }}
          >
            <Grid className="mr-1 h-5 w-5 md:h-4 md:w-4" />
            <span className="text-black">Posts</span>
          </button>
        </li>
      </ul>

      <div className="mx-auto max-w-2xl p-4" id="scrollableDiv" >
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchChallenges}
          hasMore={hasMore}
          loader={<Loading />}
          endMessage={<EndOfFeed refreshFeed={refreshFeed} />}
          scrollableTarget="scrollableDiv"
        >
          {feeds.map((feed: FeedType, index) => (
            <Feed feed={feed} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
