export interface CommentType {
  id: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  parentCommentId: string;
  numberOfReplies: number;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  level:number;
}
export interface CreateCommentPayload {
  feedId: string;
  content: string;
  mediaUrl?: string | null;
  isChallenge: boolean;
  parentCommentId?: string;
  level?: number;
}

export interface UpdateCommentPayload{
  content: string;
}
