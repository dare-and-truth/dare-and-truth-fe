export interface FeedType {
  id: string;
  type: string;
  hashtag: string;
  content: string;
  mediaUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userId: string;
  username: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  joined: boolean;
  isActive: boolean;
}
