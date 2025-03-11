'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import Loading from '@/components/Loading';
import { RankingProps } from '@/app/types';

export default function RankingDisplay({
  topUsers,
  nearbyUsers,
  loading,
  currentUserId,
}: RankingProps) {
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {topUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-800 py-6 text-center text-gray-400">
          <p className="text-lg font-semibold text-orange-400">
            🏆 No one has joined the challenge yet!
          </p>
          <p className="text-sm text-gray-300">
            Be the first to make it onto the leaderboard!
          </p>
        </div>
      ) : (
        <div className="sticky top-0 z-10 pb-4">
          <div className="mt-8 flex justify-center gap-2 sm:mt-16 sm:gap-4">
            {/* 2nd Place */}
            <div className="relative mt-8 flex w-24 flex-col items-center rounded-lg bg-black px-2 py-6 shadow-lg transition-transform duration-200 hover:-translate-y-1 sm:w-32 sm:px-4 sm:py-8 md:w-40 md:px-6">
              <div className="absolute -top-8 flex w-full justify-center sm:-top-12">
                <Avatar className="h-14 w-14 rounded-full border-4 border-orange-400 sm:h-16 sm:w-16 md:h-20 md:w-20">
                  <AvatarImage
                    src={topUsers[1]?.avatarURL}
                    alt={topUsers[1]?.username || 'User'}
                  />

                  <AvatarFallback>
                    {topUsers[1]?.username?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="mt-2 text-orange-400 sm:text-lg">Rank 🥈</span>
              <p className="mt-1 max-w-full truncate text-sm font-medium text-white sm:text-base md:text-lg">
                {topUsers[1]?.username || 'Coming soon'}
              </p>
              <p className="text-xs text-red-500 sm:text-sm">
                {topUsers[1]?.totalScore || 0} points
              </p>
            </div>

            {/* 1st Place */}
            <div className="relative flex w-28 flex-col items-center rounded-lg bg-gray-800 px-3 py-8 shadow-lg transition-transform duration-200 hover:-translate-y-1 sm:w-36 sm:px-6 sm:py-10 md:w-48 md:px-8">
              <div className="absolute -top-10 flex w-full justify-center sm:-top-14 md:-top-16">
                <Avatar className="h-16 w-16 rounded-full border-4 border-yellow-500 sm:h-20 sm:w-20 md:h-24 md:w-24">
                  <AvatarImage
                    src={topUsers[0]?.avatarURL}
                    alt={topUsers[0]?.username || 'User'}
                  />
                  <AvatarFallback>
                    {topUsers[0]?.username?.[0] || '1'}
                  </AvatarFallback>
                </Avatar>

                <Crown className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 text-yellow-400 sm:-top-6 sm:h-8 sm:w-8" />
              </div>
              <span className="text-yellow-400 sm:text-lg">Champion 🥇</span>
              <p className="mt-2 max-w-full truncate text-base font-bold text-white sm:text-lg md:text-xl">
                {topUsers[0]?.username || 'Đang cập nhật...'}
              </p>
              <p className="text-sm text-orange-400 sm:text-base md:text-lg">
                {topUsers[0]?.totalScore || 0} points
              </p>
            </div>

            {/* 3rd Place */}
            <div className="relative mt-8 flex w-24 flex-col items-center rounded-lg bg-black px-2 py-6 shadow-lg transition-transform duration-200 hover:-translate-y-1 sm:w-32 sm:px-4 sm:py-8 md:w-40 md:px-6">
              <div className="absolute -top-8 flex w-full justify-center sm:-top-12">
                <Avatar className="h-14 w-14 rounded-full border-4 border-purple-500 sm:h-16 sm:w-16 md:h-20 md:w-20">
                  <AvatarImage
                    src={topUsers[2]?.avatarURL}
                    alt={topUsers[2]?.username || 'User'}
                  />
                  <AvatarFallback>
                    {topUsers[2]?.username?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="mt-2 text-purple-500 sm:text-lg">Rank 🥉</span>
              <p className="mt-2 max-w-full truncate text-sm font-medium text-white sm:text-base md:text-lg">
                {topUsers[2]?.username || 'Coming soon'}
              </p>
              <p className="text-xs text-purple-500 sm:text-sm">
                {topUsers[2]?.totalScore || 0} points
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
          <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-lg sm:max-h-[60vh]">
            <div
              className={`${nearbyUsers.length > 1 ? 'mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:mb-40' : 'space-y-2'}`}
            >
              {nearbyUsers.map((user) => (
                <Card
                  key={user.userId}
                  className={`flex items-center rounded-xl border-0 p-2 transition-all duration-200 hover:brightness-125 sm:p-3 ${
                    user.userId === currentUserId
                      ? 'bg-gradient-to-r from-orange-400 to-purple-500'
                      : 'bg-gray-700'
                  }`}
                >
                  <Avatar className="mr-2 h-8 w-8 sm:mr-3 sm:h-10 sm:w-10">
                    <AvatarImage src={user.avatarURL} alt={user.username} />
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
