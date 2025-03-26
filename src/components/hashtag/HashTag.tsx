'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatScores } from '@/app/helpers/formatScore';
import { FeedType } from '@/app/types';
import { useState } from 'react';
import { ExpandedModal } from '@/components/ExpandedModal';

export default function HashTag({
  challenges,
  totalPosts,
}: {
  challenges: FeedType;
  totalPosts: number;
}) {
  const isVideo =
    challenges.mediaUrl?.endsWith('.mp4') ||
    challenges.mediaUrl?.endsWith('.webm');
  return (
    <>
      <motion.a
        href={`/feed/${challenges.type}/${challenges.id}`}
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
        {isVideo && challenges.mediaUrl ? (
          <video
            src={challenges.mediaUrl}
            controls
            className="relative z-10 m-2 h-16 w-40 flex-shrink-0 cursor-pointer rounded-s-lg object-cover lg:h-32 lg:w-28"
          />
        ) : (
          <Image
            src={challenges.mediaUrl}
            alt="Challenge media"
            width={0}
            height={0}
            className="relative z-10 m-2 h-16 w-16 flex-shrink-0 cursor-pointer rounded-s-lg object-cover lg:h-32 lg:w-28"
          />
        )}
        <div className="relative z-10 flex flex-1 flex-col p-4">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            # {challenges.hashtag}
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            {formatScores(totalPosts)} posts
          </p>
        </div>
      </motion.a>
    </>
  );
}
