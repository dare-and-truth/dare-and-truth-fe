import { User } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { toast } from 'react-toastify';

export const getUser = async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/users',
    });
    return response?.data;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

export const updateUser = async (data: User, id: string) => {
  await request({
    method: 'patch',
    url: `/users/${id}`,
    data,
    onSuccess: () => {
      toast.success('User status has been updated successfully');
    },
    onError: (error) => {
      console.log('error in sign up', error);
    },
  });
};
