'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Challenge } from '@/app/types';
import { getChallenges } from '@/app/api/challenge.api';
import Feed from '@/components/ChallengePage';

export default function HomePage() {
  const [allChallenge, setAllChallennge] = useState<Challenge[]>();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challenge = await getChallenges();
        if (challenge) {
          setAllChallennge(challenge);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };
    fetchChallenge();
  }, []);

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-7 pb-20 md:pb-4">
      <div className="mx-auto max-w-2xl p-4">
        {allChallenge?.map((challenge: Challenge) => (
          <Feed challenge={challenge} key={challenge.id}/>
        ))}
      </div>
    </div>
  );
}
