import { Badge, CreateBadge } from '@/app/types';
import request from '@/app/utils/Axiosconfig';
import { toast } from 'react-toastify';
export const getBadge = async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/badges',
    });
    return response?.data;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

export const createBadge = async (data: CreateBadge) => {
  await request({
    method: 'post',
    url: '/badges',
    data,
    onSuccess: () => {
      toast.success('Badge created successfully.');
    },
    onError: (error) => {
      console.log('error in create badge', error);
    },
  });
};

export const updateBadge = async (data: CreateBadge, id: string) => {
  await request({
    method: 'patch',
    url: `/badges/${id}`,
    data,
    onSuccess: () => {
      toast.success('Badge updated successfully.');
    },
    onError: (error) => {
      console.log('error in create badge', error);
    },
  });
};

export const deleteBadge = async (id: string) => {
  await request({
    method: 'delete',
    url: `/badges/${id}`,
    onSuccess: () => {
      toast.success('Badge deleted successfully.');
    },
    onError: (error) => {
      console.log('error in create badge', error);
    },
  });
};
