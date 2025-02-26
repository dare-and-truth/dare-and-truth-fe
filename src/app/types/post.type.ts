export interface Post {
  id: string;
  userId: string;
  hashtag: string;
  content: string;
  mediaUrl: string;
  isActive: boolean;
}

export type CreatePostPayload = Omit<Post, 'id' | 'userId' | 'isActive'>;

export interface CreatePostFormProps {
  selectedItemHashtag: string;
  setSelectedItemHashtag: React.Dispatch<React.SetStateAction<string | null>>;
}