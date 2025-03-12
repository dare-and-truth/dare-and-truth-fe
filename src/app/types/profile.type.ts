export interface UserProfile {
  id: string;
  isActive?: string;
  username: string;
  email?: string;
  avatarUrl: null | string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
}

export interface StatusFriend {
  typeOfRequest: string;
  requestId: string;
}

export interface FriendProps {
  type: string;
  handleAddFriend: () => void;
  handleAccept: () => void;
  handleReject: () => void;
  handleUnfriend: () => void;
}
