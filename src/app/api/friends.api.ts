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
      console.log("error when create request:",error);
      throw error;
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
    console.log("error when get all requests:",error);
    throw error;
  }
};

// API for accepting a friend request
export const acceptFriendRequest = async (  data:AcceptedFriendPayLoad) => {
  try {
    const response = await request({
      method: 'patch',
      url: `/requests/accept?requestId=${data.requestId}`,
    });
    return response;
  } catch (error) {
    console.log("error when accept request:",error);
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
    console.log("error when reject request:",error);
    throw error;
  }
};

// API for deleting a friend
export const unFriend = async ( friendId: string) => {
  try {
    const response = await request({
      method: 'delete',
      url: `/requests/delete?friendId=${friendId}`,
    });
    return response;
  } catch (error) {
    console.log("error when delete request:",error);
    throw error;
  }
};
