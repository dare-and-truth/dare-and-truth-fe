'use client';

import { getScoreByUserId } from '@/app/api/score.api';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


export default function ProgressMonster({ userId }: { userId: string }) {
  const [score, setScore] = useState<number>(0);
  const totalScore = 10000;
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await getScoreByUserId(userId);
        console.log(response);
        if (response) {
          setScore(response.totalScore);
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
      }
    };
    fetchScore();
  }, [userId]);

  const completedScore = score;
  const remainingScore = totalScore - completedScore;
  const progress = Math.min((completedScore / totalScore) * 100, 100);

  const getMonsterImage = () => {
    if (completedScore >= 10000) return '/images/monster-levelfour.png';
    if (completedScore >= 1000) return '/images/monster-leveltwo.png';
    if (completedScore >= 100) return '/images/monster-levelthree.png';
    return '/images/monster-levelone.png';
  };

  return (
    <motion.div
      className="relative flex w-full flex-row items-center overflow-hidden rounded-lg border border-gray-200 bg-white p-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hiệu ứng nền xoay */}
      <motion.div
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      >
        <div className="h-full w-full bg-gradient-to-b from-cyan-400 to-fuchsia-500"></div>
      </motion.div>

      {/* Lớp phủ để giữ nội dung rõ ràng */}
      <div className="absolute inset-[5px] rounded-lg bg-white dark:bg-gray-800"></div>

      {/* Monster image and progress stats */}
      <motion.div
        className="relative z-10 float-left"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Image
          src={getMonsterImage()}
          alt="Monster"
          width={100}
          height={140}
          className="animate-bounce"
        />
      </motion.div>

      {/* Progress Bar */}
      <div className="relative z-10 ml-4 w-full">
       

        {/* Animated Progress Bar */}
        <div className="ml-4 w-full">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800">
              {completedScore > 0
                ? "You're making progress!"
                : "Let's get started!"}
            </h2>
            <p className="text-sm text-gray-600">
              {completedScore} done / {remainingScore} left to defeat
            </p>
          </div>
          <Progress
            value={progress}
            className="mt-2 h-4 w-full rounded-full bg-gray-200"
          />
          {/* Score labels */}
          <div className="mt-1 flex w-full justify-between text-xs text-gray-600">
            <span>{completedScore}</span>
            <span className="font-bold text-blue-600">Goal: {totalScore}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
