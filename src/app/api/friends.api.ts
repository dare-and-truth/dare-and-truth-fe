import { CreateRequestRequestPayload,AcceptedFriendPayLoad } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';


// Define the expected error structure
interface ErrorResponse {
  message: string;
}

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
      const errorMessage = (error.response?.data as ErrorResponse)?.message || 'An error occurred while creating the friend request.';
      toast.error(errorMessage);
    },
  });
};

// API for fetching all friend requests for a user
export const getAllFriendRequests = async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/requests/user`,
    });
    console.log("data trong api get:", response);
    return response?.data;
  } catch (error) {
    const errorMessage = (error as AxiosError)?.response?.data as ErrorResponse;
    toast.error(errorMessage?.message || 'An error occurred while fetching friend requests.');
    throw error;
  }
};

// API for accepting a friend request
export const acceptFriendRequest = async (  data:AcceptedFriendPayLoad) => {
  console.log("request ID trogn api:", data);
  try {
    const response = await request({
      method: 'patch',
      url: `/requests/accept?requestId=${data.requestId}`,
    });
    console.log("data trong api accept:", response);
    return response;
  } catch (error) {
    const errorMessage = (error as AxiosError)?.response?.data as ErrorResponse;
    toast.error(errorMessage?.message || 'An error occurred while accepting the friend request.');
    throw error;
  }
};

// API for rejecting a friend request
export const rejectFriendRequest = async (data:AcceptedFriendPayLoad) => {
  try {
    const response = await request({
      method: 'delete',
      url: `/requests/reject?requestId=${data.requestId}`,
      data,
    });
    return response;
  } catch (error) {
    const errorMessage = (error as AxiosError)?.response?.data as ErrorResponse;
    toast.error(errorMessage?.message || 'An error occurred while rejecting the friend request.');
    throw error;
  }
};

// API for deleting a friend
export const deleteFriend = async ( friendId: string) => {
  try {
    const response = await request({
      method: 'delete',
      url: `/requests/delete?friendId=${friendId}`,
    });
    return response?.data;
  } catch (error) {
    const errorMessage = (error as AxiosError)?.response?.data as ErrorResponse;
    toast.error(errorMessage?.message || 'An error occurred while deleting the friend.');
    throw error;
  }
};
