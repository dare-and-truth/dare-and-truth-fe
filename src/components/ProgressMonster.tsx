'use client';

import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

export default function ProgressMonster() {
  const totalScore = 10000;
  const completedScore = 1092;
  const remainingScore = totalScore - completedScore;
  const progress = (completedScore / totalScore) * 100;

  return (
    <div className="flex max-w-md flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      {/* Monster image and progress stats */}
      <div className="flex w-full items-center gap-4">
        <Image
          src="/images/default-profile.png"
          alt="Monster"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">
            You're off to a great start!
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
