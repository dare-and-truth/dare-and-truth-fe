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
    acceptedAt: string;
}

export interface FriendRequestCardProps {
    avatar: string;
    username: string;
    followAt: string;
    isAccepted: boolean;
    acceptedAt?: string;
    requestId: string;
    followerId:string;
    userId:string;
}

export interface AcceptedFriendPayLoad{
    requestId: string;
}