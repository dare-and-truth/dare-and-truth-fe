import request from '@/app/utils/Axiosconfig';

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
