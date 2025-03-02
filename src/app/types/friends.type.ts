// app/types.ts
export interface GetFeedResponse {
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
  isLiked: boolean;
  isJoined: boolean;
}

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
  isLiked: boolean;
  isJoined: boolean;
  isActive?: boolean;
}

export interface CreateRequestRequestPayload {
  userId: string;
  followerId: string;
}

export interface FriendRequest {
  id: string;
  follower: {
    id: string;
    username: string;
  };
  user: {
    id: string;
    username: string;
  };
  followedAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
}

export interface FriendList {
  id: string;
  follower: {
    id: string;
    username: string;
  };
  user: {
    id: string;
    username: string;
  };
  isAccepted: boolean;
  followedAt: string;
  acceptedAt?: string;
}

export interface UserWithRequestsResponse {
  user: {
    id: string;
    username: string;
  };
  requests: Array<{
    id: string;
    followedAt: string;
    acceptedAt?: string;
    user: {
      id: string;
      username: string;
    };
    isAccepted: boolean;
    follower: {
      id: string;
      username: string;
    };
  }>;
}

export interface FriendRequestCardProps {
  avatar: string;
  username: string;
  followedAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
  requestId: string;
  followerId: string;
  userId?: string;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onUnfriend?: (requestId: string) => void;
  onAddFriend?: (userId: string, followerId: string) => void;
  mode?: 'requests' | 'friends' | 'search';
}

export interface AcceptedFriendPayLoad {
  requestId: string;
}

export interface RejectFriendPayload {
  requestId: string;
}

export interface UnfriendPayload {
  targetId: string;
}