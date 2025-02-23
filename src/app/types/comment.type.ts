export interface Comment {
  id: string;
  userId: string;
  content: string;
  mediaUrl: string;
  createAt: string;
}

export interface CreateCommentPayload {
  feedId: string;
  content: string;
  mediaUrl?: string | null;
  isChallenge: boolean;
}
