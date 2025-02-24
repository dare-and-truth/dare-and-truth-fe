import { ReactNode } from 'react';

export interface Challenge {
  id: string;
  userId: string;
  hashtag: string;
  content: string;
  mediaUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type CreateChallengePayload = Omit<
  Challenge,
  'id' | 'userId' | 'isActive'
>;

export interface IPropsChallenge {
  challenge: ChallengeAsFeed;
  button?: ReactNode;
}

export interface ChallengeAsFeed extends Challenge {
  userId: string;
  username: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}
