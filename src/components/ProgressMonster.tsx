'use client';

import { getScoreByUserId } from '@/app/api/score.api';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProgressMonster({ userId }: { userId: string }) {
  const [score, setScore] = useState<number | null>(null);
  const totalScore = 10000; // Mục tiêu cuối cùng

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await getScoreByUserId(userId);
        console.log(response);
        if (response) {
          setScore(response.totalScore); // Fix: "toalScore" -> "totalScore"
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
      }
    };
    fetchScore();
  }, [userId]);

  const completedScore = 1000; // Nếu score chưa có, mặc định là 0
  const remainingScore = totalScore - completedScore;
  const progress = Math.min((completedScore / totalScore) * 100, 100); // Đảm bảo không vượt quá 100%

  // Xác định hình ảnh monster dựa trên số điểm
  const getMonsterImage = () => {
    if (completedScore >= 10000) return '/images/monster-levelfour.png';
    if (completedScore >= 1000) return '/images/monster-leveltwo.png';
    if (completedScore >= 100) return '/images/monster-levelthree.png';
    return '/images/monster-levelone.png';
  };

  return (
    <div className="flex max-w-md flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      {/* Monster image and progress stats */}
      <div className="flex w-full items-center gap-4">
        <Image
          src={getMonsterImage()}
          alt="Monster"
          width={50}
          height={50}
          className="rounded-full"
        />
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
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full">
        <Progress
          value={progress}
          className="h-4 w-full rounded-full bg-gray-200"
        />
        {/* Score labels */}
        <div className="mt-1 flex w-full justify-between text-xs text-gray-600">
          <span>{completedScore}</span>
          <span>Goal: {totalScore}</span>
        </div>
      </div>
    </div>
  );
}
