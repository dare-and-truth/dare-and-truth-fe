'use client';

import { useParams, useSearchParams } from 'next/navigation';
import HashTag from '@/components/hashtag/HashTag';
import PostHashTag from '@/components/hashtag/PostHashTag';
import { getChallengeDetailByHashTag } from '@/app/api/challenge.api';
import { use, useEffect, useState } from 'react';
import { FeedType } from '@/app/types';
import Image from 'next/image';
import { formatScores } from '@/app/helpers/formatScore';
import { motion } from 'framer-motion';
import Link from 'next/link';


export default function HashtagChallengePage() {
  const params = useParams();
  const hashtag = params.id as string; // Lấy path parameter từ URL
  const searchParams = useSearchParams(); // Lấy query parameter
  const startDate = searchParams.get('startDate'); // '2025-03-04'
  const endDate = searchParams.get('endDate'); // '2025-04-04'
  const [challenges, setChallenges] = useState<FeedType>();
  const [posts, setPosts] = useState<FeedType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, [hashtag, startDate, endDate]);
  console.log(challenges);
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="p-2 sm:p-4">
        {/* <HashTag challenges={challenges} totalPosts={totalPosts} /> */}
        <motion.a
          href="#"
          className="relative flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl"
        >
          {/* Hiệu ứng nền xoay */}
          <motion.div
            className="absolute inset-0 h-full w-full"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          >
            <div className="h-full w-full bg-gradient-to-b from-cyan-400 to-fuchsia-500"></div>
          </motion.div>

          {/* Lớp phủ giữ nền ổn định */}
          <div className="absolute inset-[5px] rounded-lg bg-white dark:bg-gray-800"></div>

          {/* Nội dung card */}
          <Image
            className="relative z-10 h-16 w-16 flex-shrink-0 rounded-s-lg object-cover lg:h-32 lg:w-28"
            src={challenges?.mediaUrl || '/images/monster-levelone.png'} 
            width={0}
            height={0}
            alt="Monster Level One"
          />
          <div className="relative z-10 flex flex-1 flex-col p-4">
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              # {challenges?.hashtag}
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              {formatScores(totalPosts)} posts
            </p>
          </div>
        </motion.a>
        <h2 className="mt-4 text-xl font-bold">Do Challenge</h2>
        {/* <PostHashTag hashtag={hashtag} posts={posts} /> */}
        <div className="grid grid-flow-row grid-cols-3 justify-items-stretch gap-2 text-neutral-600 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
          {posts.map((item) => (
            <div className="mt-4" key={item.id}>
              <Link
                href={`/feed/${item.type}/${item.id}`}
                className="cursor-pointer"
              >
                <Image
                  src={item.mediaUrl}
                  className="dark:shadow-gray-900object-cover h-full w-full rounded-md border border-gray-200"
                  alt="Monster Level One"
                  width={0}
                  height={0}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
