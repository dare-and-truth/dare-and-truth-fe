import {
  CreateRequestRequestPayload,
} from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { AxiosError } from 'axios';

// API for creating a friend request
export const createFriendRequest = async (
  data: CreateRequestRequestPayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'post',
    url: '/requests',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error: AxiosError) => {
      console.log('error when create request:', error);
      throw error;
    },
  });
};

// API for fetching all friend requests for a user
export const getAllFriendRequests = async () => {
  const response = await request({
    method: 'get',
    url: `/requests`,
  });
  return response?.data;
};

// API for fetching all accepted friends
export const getAllFriendsList = async () => {
  const response = await request({
    method: 'get',
    url: `/requests/acceptance`,
  });
  return response?.data;
};

// API for accepting a friend request
export const acceptFriendRequest = async (
  requestId:string,
  handleSuccess: (response: any) => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'patch',
    url: `/requests/accept?requestId=${requestId}`,
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when accepting request:', error);
      handleError?.(error);
    },
  });
};

// API for rejecting a friend request
export const rejectFriendRequest = async (
  requestId:string,
  handleSuccess: (response: any) => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'delete',
    url: `/requests/reject?requestId=${requestId}`,
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when rejecting request:', error);
      handleError?.(error);
    },
  });
};

// API for deleting (unfriending) a friend
export const unFriend = async (
  targetId: string,
  handleSuccess: (response: any) => void,
  handleError?: (error: any) => void,
) => {
  await request({
    method: 'delete',
    url: `/requests/un-friend?friendId=${targetId}`,
    onSuccess: handleSuccess,
    onError: (error: AxiosError) => {
      console.log('Error when unfriending:', error);
      handleError?.(error);
    },
  });
};
