'use client';

import { useEffect, useState } from 'react';
import { geChallengeRanking } from '@/app/api/ranking.api';
import { Ranking } from '@/app/types';
import LeaderboardDisplay from '@/components/Ranking';
import { useParams } from 'next/navigation';

export default function RankingPage() {
  // In a client component, we should use useEffect to access localStorage
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [topUsers, setTopUsers] = useState<Ranking[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const challengeId = params.id as string;
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const response = await geChallengeRanking(challengeId);
        if (response) {
          // Sort the ranking list by rank
          const sortedRanking = [...response].sort((a, b) => a.rank - b.rank);
          const top3 = sortedRanking.slice(0, 3);
          setTopUsers(top3);

          // Remaining users after removing Top 3
          let remainingUsers = sortedRanking.slice(3);

          // Check if current user is in Top 3
          const isCurrentUserInTop3 = top3.some(
            (user) => user.userId === currentUserId,
          );

          if (!isCurrentUserInTop3 && currentUserId) {
            const currentUser = response.find(
              (user: Ranking) => user.userId === currentUserId,
            );
            if (currentUser) {
              // Move current user to the top of nearbyUsers
              remainingUsers = [
                currentUser,
                ...remainingUsers.filter(
                  (user) => user.userId !== currentUserId,
                ),
              ];
            }
          }

          setNearbyUsers(remainingUsers);
        }
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [currentUserId, challengeId]);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden p-2 pb-20 sm:p-4 md:p-7 md:pb-4">
      <div className="mx-auto max-w-2xl p-2 sm:p-4">
        <LeaderboardDisplay
          topUsers={topUsers}
          nearbyUsers={nearbyUsers}
          loading={loading}
          currentUserId={currentUserId}
          type="Like"
        />
      </div>
    </div>
  );
}
