'use client';

import { getScoreByUserId } from '@/app/api/score.api';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProgressMonster({ userId }: { userId: string }) {
  const [score, setScore] = useState<number>(0);
  const [prevScore, setPrevScore] = useState<number>(0); // Theo dõi score trước đó
  const totalScore = 5000;
  const milestones = [
    {
      value: 100,
      image_gift: '/images/gift.png',
      open_image_gift: '/images/open-box.png',
    },
    {
      value: 1000,
      image_gift: '/images/gift-box.png',
      open_image_gift: '/images/open-box.png',
    },
    {
      value: 2000,
      image_gift: '/images/gift (3).png',
      open_image_gift: '/images/open-box.png',
    },
    {
      value: 3500,
      image_gift: '/images/gift (4).png',
      open_image_gift: '/images/open-box.png',
    },
    {
      value: 5000,
      image_gift: '/images/presents.png',
      open_image_gift: '/images/open-box.png',
    },
  ];

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await getScoreByUserId(userId);
        if (response) {
          setScore(response.totalScore);
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
      }
    };
    fetchScore();
  }, [userId]);
  useEffect(() => {
    const crossedMilestone = milestones.find(
      (milestone) => prevScore < milestone.value && score >= milestone.value,
    );
    if (crossedMilestone) {
      toast.success(
        `Congratulations! You have reached ${completedScore} points!`,
      );
    }
    setPrevScore(score); // Cập nhật prevScore sau khi kiểm tra
  }, [score]);
  const completedScore = score;
  // Tìm milestone tiếp theo
  const nextMilestone =
    milestones.find((milestone) => milestone.value > completedScore)?.value ||
    totalScore;

  const progress = Math.min((completedScore / totalScore) * 100, 100);

  const getMonsterImage = () => {
    if (completedScore >= 5000) return '/images/monster-levelsix.png';
    if (completedScore >= 3500) return '/images/monster-levelfive.png';
    if (completedScore >= 2000) return '/images/monster-levelfour.png';
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

      {/* Lớp phủ */}
      <div className="absolute inset-[5px] rounded-lg bg-white dark:bg-gray-800"></div>

      {/* Monster image */}

      <Image
        src={getMonsterImage()}
        alt="Monster"
        width={100}
        height={140}
        className="animate-bounce"
      />

      {/* Progress Bar và Milestones */}
      <div className="relative z-10 ml-4 w-full">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">
            {completedScore > 0
              ? "You're making progress!"
              : "Let's get started!"}
          </h2>
          <p className="text-sm text-gray-600">
            {completedScore} done / {nextMilestone} left to defeat
          </p>
        </div>

        {/* Thanh Progress và Milestones */}
        <div className="relative mb-12 mt-4">
          <Progress value={progress} className="h-4 w-full rounded-full" />
          <motion.div
            className="absolute top-0 h-full w-2 rounded-full bg-yellow-300"
            style={{
              left: `${progress}%`,
              transform: 'translateX(-50%)',
              boxShadow: '0px 0px 20px 8px rgba(255, 165, 0, 0.9)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
          ></motion.div>

          <div className="absolute top-11 flex w-full -translate-y-1/2 justify-between">
            {milestones.map((milestone, index) => {
              const milestoneProgress = (milestone.value / totalScore) * 100;
              const isCompleted = completedScore >= milestone.value;
              const offsetRight = index === milestones.length - 1 ? -20 : 0;
              const offsetLeft = index === 0 ? 10 : 0;
              return (
                <div
                  key={index}
                  className="absolute -top-12 flex flex-col items-center"
                  style={{
                    left: `calc(${milestoneProgress}% + ${offsetRight}px + ${offsetLeft}px)`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? 'border-green-500 bg-white'
                        : 'border-black bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-black" />
                    ) : (
                      <></>
                    )}
                  </div>

                  <span className="mt-2 text-sm">{milestone.value}</span>
                  <Image
                    src={
                      isCompleted
                        ? milestone.open_image_gift
                        : milestone.image_gift
                    }
                    alt="Gift"
                    width={24}
                    height={24}
                    className={isCompleted ? 'animate-bounce' : ''}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
