'use client';

import { useParams, useSearchParams } from 'next/navigation';
import HashTag from '@/components/hashtag/HashTag';
import PostHashTag from '@/components/hashtag/PostHashTag';
import { getChallengeDetailByHashTag } from '@/app/api/challenge.api';
import { useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Loading from '@/components/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITEMS_PER_PAGE } from '@/app/constants';

export default function HashtagChallengePage() {
  const params = useParams();
  const hashtag = params.id as string;
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const [challenges, setChallenges] = useState<FeedType | null>(null);
  const [posts, setPosts] = useState<FeedType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!hashtag || !startDate || !endDate) return;

      setLoading(true);
      try {
        const response = await getChallengeDetailByHashTag(
          hashtag,
          startDate,
          endDate,
          0,
          6,
        );
        setTotalPosts(response.totalPosts + response.feeds.length);
        setChallenges(response.feeds[0]);
        setPosts(response.feeds.slice(1));
        setPageNumber(1);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [hashtag, startDate, endDate]);

  const fetchMoreData = async () => {
    if (!hashtag || !startDate || !endDate || loading) return;

    try {
      const response = await getChallengeDetailByHashTag(
        hashtag,
        startDate,
        endDate,
        pageNumber,
        6,
      );
      setPosts((prev) => [...prev, ...response.feeds]); // Nối thêm dữ liệu
      setPageNumber((prev) => prev + 1); // Cập nhật trang tiếp theo

      if (response.feeds.length === 0) {
        setHasMore(false); // Dừng tải nếu không còn dữ liệu
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };
  useEffect(() => {
    setPageNumber(0); // Reset trang về 0 khi hashtag thay đổi
  }, [hashtag, startDate, endDate]);

  if (loading && posts.length === 0) return <Loading />;
  console.log('Fetching:', hashtag, startDate, endDate, pageNumber, 5);

  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4"
      id="scrollableDiv"
    >
      <div className="p-2 sm:p-4">
        {challenges && (
          <HashTag challenges={challenges} totalPosts={totalPosts} />
        )}

        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loading />}
          scrollableTarget="scrollableDiv"
        >
          {posts.length > 0 && <PostHashTag posts={posts} />}
        </InfiniteScroll>
      </div>
    </div>
  );
}
