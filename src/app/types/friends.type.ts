// app/types.ts
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


export interface FriendRequestCardProps {
  avatar: string;
  username: string;
  followedAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
  requestId: string;
  followerId: string;
  userId?: string;
  width?: string;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onUnfriend?: (requestId: string) => void;
  onAddFriend?: (userId: string, followerId: string) => void;
  mode?: 'requests' | 'friends' | 'search';
}