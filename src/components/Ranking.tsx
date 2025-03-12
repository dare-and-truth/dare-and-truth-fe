'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import Loading from '@/components/Loading';
import { RankingProps } from '@/app/types';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
export default function RankingDisplay({
  topUsers,
  nearbyUsers,
  loading,
  currentUserId,
}: RankingProps) {
  const [windowDimesion, setDimesion] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const detectSize = () => {
    setDimesion({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => {
      window.removeEventListener('resize', detectSize);
    };
  }, [windowDimesion]);
  if (loading) {
    return <Loading />;
  }
  const formatPoints = (scores: number) => {
    if (scores < 10_000) return scores.toString();

    const kScores = (scores / 1000).toFixed(2); // Chia cho 1000 và giữ 2 số thập phân
    return kScores.endsWith('.00') ? `${parseInt(kScores)} K` : `${kScores} K`;
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Confetti
          width={windowDimesion.width / 1.8}
          height={windowDimesion.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.2}
          colors={[
            '#f97316',
            '#fcd34d',
            '#a855f7',
            '#e00d0d',
            '#1aeb24',
            '#f766dc',
            '#0d936f',
            '#3b82f6',
          ]}
          className="ml-40"
        />
      </motion.div>

      {topUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400">
          <p className="text-lg font-semibold text-orange-400">
            🏆 No one has joined the challenge yet!
          </p>
          <p className="text-sm">
            Be the first to make it onto the leaderboard!
          </p>
        </div>
      ) : (
        <div className="sticky top-0 z-10 pb-4">
          <div className="mt-20 flex justify-center md:mt-16">
            {/* 2nd Place */}
            <div className="relative mt-8 flex w-24 flex-col items-center rounded-tl-[2.5rem] bg-black px-2 py-6 shadow-lg transition-all duration-200 hover:brightness-125 sm:w-32 sm:px-4 sm:py-8 md:w-40 md:px-6">
              <div className="absolute -top-8 flex w-full justify-center sm:-top-8">
                <Avatar className="h-14 w-14 rounded-full border-4 border-orange-400 sm:h-16 sm:w-16 md:h-16 md:w-16">
                  <AvatarImage
                    src={topUsers[1]?.avatarURL}
                    alt={topUsers[1]?.username || 'User'}
                    className="object-cover"
                  />

                  <AvatarFallback>
                    {topUsers[1]?.username?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="mt-10 text-3xl text-orange-400 sm:text-4xl">
                🥈
              </span>
              <p className="mt-1 max-w-full truncate text-sm font-medium text-white sm:text-base">
                {topUsers[1]?.username || 'Coming soon'}
              </p>
              <p className="text-xs text-orange-500 sm:text-sm">
                {formatPoints(topUsers[1]?.totalScore || 0)} score
              </p>
            </div>

            {/* 1st Place */}

            <div className="relative flex min-h-[220px] w-28 flex-col items-center rounded-t-[2.2rem] bg-[#454545] px-3 py-14 shadow-lg transition-all duration-200 hover:brightness-110 sm:w-36 sm:px-6 sm:py-16 md:w-48 md:px-8">
              <div className="absolute -top-8 flex w-full justify-center md:-top-12">
                <Avatar className="h-16 w-16 rounded-full border-4 border-yellow-500 sm:h-24 sm:w-24 md:h-20 md:w-20">
                  <AvatarImage
                    src={topUsers[0]?.avatarURL}
                    alt={topUsers[0]?.username || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {topUsers[0]?.username?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>

                <Crown className="absolute -top-6 left-1/2 h-8 w-8 -translate-x-1/2 text-yellow-400 sm:-top-8 sm:h-10 sm:w-10" />
              </div>
              <span className="mt-3 text-3xl text-yellow-400 sm:text-4xl">
                {' '}
                🥇
              </span>

              <p className="mt-3 max-w-full truncate text-base text-white sm:text-lg">
                {topUsers[0]?.username || 'Coming soon'}
              </p>
              <p className="text-sm text-orange-400 sm:text-base md:text-lg">
                {formatPoints(topUsers[0]?.totalScore || 0)} score
              </p>
            </div>

            {/* 3rd Place */}
            <div className="relative mt-8 flex w-24 flex-col items-center rounded-tr-[2.5rem] bg-black px-2 py-6 shadow-lg transition-all duration-200 hover:brightness-125 sm:w-32 sm:px-4 sm:py-8 md:w-40 md:px-6">
              <div className="absolute -top-8 flex w-full justify-center sm:-top-8">
                <Avatar className="h-14 w-14 rounded-full border-4 border-purple-500 sm:h-16 sm:w-16 md:h-16 md:w-16">
                  <AvatarImage
                    src={topUsers[2]?.avatarURL}
                    alt={topUsers[2]?.username || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {topUsers[2]?.username?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="mt-10 text-3xl text-purple-500 sm:text-4xl">
                🥉
              </span>
              <p className="mt-2 max-w-full truncate text-sm font-medium text-white sm:text-base">
                {topUsers[2]?.username || 'Coming soon'}
              </p>
              <p className="text-xs text-purple-500 sm:text-sm">
                {formatPoints(topUsers[2]?.totalScore || 0)} score
              </p>
            </div>
          </div>
        </div>
      )}

      {nearbyUsers.length > 0 && (
        <>
          <h2 className="mb-3 px-1 font-medium text-orange-400">
            📍 Players near you
          </h2>
          <div className="mt-4 max-h-[50vh] overflow-auto rounded-lg sm:max-h-[60vh]">
            <div
              className={`mt-2 grid gap-2 ${nearbyUsers.length > 1 ? 'mb-32 grid-cols-1 sm:grid-cols-2 md:mb-48' : 'mb-48 space-y-2'}`}
            >
              {nearbyUsers.map((user) => (
                <Card
                  key={user.userId}
                  className={`flex items-center rounded-xl border-0 p-2 transition-all duration-200 hover:brightness-125 sm:p-3 ${
                    user.userId === currentUserId
                      ? 'bg-gradient-to-r from-orange-400 to-purple-500'
                      : 'bg-[#2E3034]'
                  }`}
                >
                  <Avatar className="mr-2 h-8 w-8 sm:mr-3 sm:h-10 sm:w-10">
                    <AvatarImage
                      src={user.avatarURL}
                      alt={user.username}
                      className="object-cover"
                    />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-200 sm:text-sm">
                      {user.totalScore} points
                    </p>
                  </div>
                  <div className="ml-2 flex items-center rounded-full border border-white">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white sm:h-6 sm:w-6 sm:text-sm">
                      {user.rank}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
