export interface Post {
  id: string;
  userId: string;
  hashtag: string;
  content: string;
  mediaUrl: string;
  isActive: boolean;
}

export type CreatePostPayload = Omit<Post, 'id' | 'userId' | 'isActive'>;
