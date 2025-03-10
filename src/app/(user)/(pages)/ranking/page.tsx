'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react'; // Sử dụng biểu tượng vương miện từ lucide-react
import { useEffect, useState } from 'react';
import { getAllRanking } from '@/app/api/ranking.api';
interface Ranking {
  userId: string;
  username: string;
  avatarURL: string;
  totalScore: number;
  rank: number;
}

export default function Leaderboard() {
  const currentUserId = localStorage.getItem('userId'); // Thay thế bằng user hiện tại
  const [topUsers, setTopUsers] = useState<Ranking[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<Ranking[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const response = await getAllRanking();
      if (response) {
        // Sắp xếp danh sách theo rank
        const sortedRanking = [...response].sort((a, b) => a.rank - b.rank);
        const top3 = sortedRanking.slice(0, 3);
        setTopUsers(top3);

        // Danh sách còn lại sau khi bỏ Top 3
        let remainingUsers = sortedRanking.slice(3);

        // Kiểm tra user hiện tại có trong Top 3 không
        const isCurrentUserInTop3 = top3.some(
          (user) => user.userId === currentUserId,
        );
        if (!isCurrentUserInTop3) {
          const currentUser = response.find(
            (user: Ranking) => user.userId === currentUserId,
          );
          if (currentUser) {
            // Đưa user hiện tại lên đầu nearbyUsers
            remainingUsers = [
              currentUser,
              ...remainingUsers.filter((user) => user.userId !== currentUserId),
            ];
          }
        }

        setNearbyUsers(remainingUsers); // Không giới hạn số lượng
      }
    };
    fetchRanking();
  }, []);
  const formatScore = (score: number) => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(0)}K`;
    return score.toString();
  };

return (
  <div className="h-[calc(100vh-4rem)] overflow-hidden p-7 pb-20 md:pb-4">
    <div className="mx-auto max-w-2xl p-4">
      {/* Top 3 Section (Cố định) */}
      <div className="sticky top-0 z-10 pb-4">
        <div className="flex items-end justify-center space-x-4">
          {topUsers.length >= 3 && (
            <>
              {/* 2nd Place */}
              <div className="order-0 mb-2 flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-gray-600">
                  <AvatarImage
                    src={topUsers[1]?.avatarURL || '/placeholder.svg'}
                    alt={topUsers[1]?.username}
                  />
                  <AvatarFallback>{topUsers[1]?.username?.[0]}</AvatarFallback>
                </Avatar>
                <p className="mt-2 font-medium text-red-500">
                  {topUsers[1]?.username}
                </p>
                <p className="text-sm text-red-500">
                  {formatScore(topUsers[1]?.totalScore)}
                </p>
              </div>

              {/* 1st Place */}
              <div className="order-1 -mt-4 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-yellow-400">
                    <AvatarImage
                      src={topUsers[0]?.avatarURL || '/placeholder.svg'}
                      alt={topUsers[0]?.username}
                    />
                    <AvatarFallback>
                      {topUsers[0]?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Crown className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 text-yellow-400" />
                </div>
                <p className="mt-2 font-medium text-white">
                  {topUsers[0]?.username}
                </p>
                <p className="text-sm text-orange-400">
                  {formatScore(topUsers[0]?.totalScore)}
                </p>
              </div>

              {/* 3rd Place */}
              <div className="order-2 mb-2 flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-gray-600">
                  <AvatarImage
                    src={topUsers[2]?.avatarURL || '/placeholder.svg'}
                    alt={topUsers[2]?.username}
                  />
                  <AvatarFallback>{topUsers[2]?.username?.[0]}</AvatarFallback>
                </Avatar>
                <p className="mt-2 font-medium text-purple-500">
                  {topUsers[2]?.username}
                </p>
                <p className="text-sm text-purple-500">
                  {formatScore(topUsers[2]?.totalScore)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nearby Ranks Section (Cuộn được) */}
      <div className="max-h-[60vh] overflow-y-auto">
        <h2 className="mb-3 px-1 font-medium text-orange-400">
          Ranks near you
        </h2>
        <div className="space-y-2">
          {nearbyUsers.map((user) => (
            <Card
              key={user.userId}
              className={`flex items-center rounded-xl border-0 p-3 ${
                user.userId === currentUserId
                  ? 'bg-gradient-to-r from-orange-400 to-purple-500'
                  : 'bg-gray-800'
              }`}
            >
              <Avatar className="mr-3 h-10 w-10">
                <AvatarImage src={user.avatarURL} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-white">{user.username}</p>
                <p className="text-sm text-gray-200">
                  {formatScore(user.totalScore)} point
                </p>
              </div>
              <div className="flex items-center rounded-full border border-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-white">
                  {user.rank}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}
