'use client';

import { useParams, useSearchParams } from 'next/navigation';
import HashTag from '@/components/hashtag/HashTag';
import PostHashTag from '@/components/hashtag/PostHashTag';
import { getChallengeDetailByHashTag } from '@/app/api/challenge.api';
import { useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Loading from '@/components/Loading';

export default function HashtagChallengePage() {
  const params = useParams();
  const hashtag = params.id as string; // Lấy path parameter từ URL
  const searchParams = useSearchParams(); // Lấy query parameter
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [challenges, setChallenges] = useState<FeedType>();
  const [posts, setPosts] = useState<FeedType[]>();
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
          if (loading) return;

          setLoading(true);
      try {
        if (hashtag && startDate && endDate) {
          const response = await getChallengeDetailByHashTag(
            hashtag,
            startDate,
            endDate,
            0,
            10,
          );
          setTotalPosts(response.totalPosts); // Lưu tổng số bài viết của challenge
          setChallenges(response.feeds[0]); // Lấy bài đầu tiên làm challenge
          setPosts(response.feeds.slice(1)); // Lấy các bài còn lại làm posts
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hashtag, startDate, endDate]);
  if(loading) return( <Loading /> );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="p-2 sm:p-4">
        {challenges && (
          <HashTag challenges={challenges} totalPosts={totalPosts} />
        )}

        {posts && <PostHashTag posts={posts} />}
      </div>
    </div>
  );
}
