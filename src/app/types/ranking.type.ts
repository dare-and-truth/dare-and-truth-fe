export interface Ranking {
  userId: string;
  username: string;
  avatarURL: string;
  totalScore: number;
  rank: number;
}

export interface RankingProps {
  topUsers: Ranking[];
  nearbyUsers: Ranking[];
  loading: boolean;
  currentUserId: string | null;
  type:string;
}
