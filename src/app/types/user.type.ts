export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  avatarUrl?: string;
  isAdmin?: string;
  fcmToken?: string;
}

export interface UserWithRequestsResponse {
  user: {
    [x: string]: string;
    id: string;
    username: string;
    avatarUrl: string;
  };
  requests: Array<{
    id: string;
    followedAt: string;
    acceptedAt?: string;
    user: {
      id: string;
      username: string;
      avatarUrl: string;
    };
    isAccepted: boolean;
    follower: {
      id: string;
      username: string;
      avatarUrl: string;
    };
  }>;
}

export type UserInfo = {
  id: string;
  username: string;
  avatarUrl: string;
};
