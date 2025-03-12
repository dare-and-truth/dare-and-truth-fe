export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  avatar?: string;
  isAdmin?: string;
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

export type UserInfo = {
  id: string;
  username: string;
  avatarUrl: string;
}