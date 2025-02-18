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

export type CreateChallengePayload = Omit<Challenge, 'id' | 'isActive'>;
