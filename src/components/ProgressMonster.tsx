'use client';

import { getScoreByUserId } from '@/app/api/score.api';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
    <div className="flex w-full flex-row items-center rounded-lg border border-gray-200 bg-white p-8">
      {/* Monster image and progress stats */}
      <div className="float-left">
        <Image
          src={getMonsterImage()}
          alt="Monster"
          width={100}
          height={140}
          className="animate-bounce"
        />
      </div>

      {/* Progress Bar */}
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
  );
}
