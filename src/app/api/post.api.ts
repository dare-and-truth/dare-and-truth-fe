import { CreatePostPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { toast } from 'react-toastify';

export const getPost = async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/posts',
    });
    return response?.data;
  } catch (error) {
    console.error('Error in get posts:', error);
    throw error;
  }
};

export const postPost = async (
  data: CreatePostPayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'post',
    url: '/posts',
    data,
    onSuccess: () => {
      toast.success('Create post successfully');
      handleSuccess();
    },
    onError: (error) => {
      console.log('error in create post', error);
    },
  });
};
