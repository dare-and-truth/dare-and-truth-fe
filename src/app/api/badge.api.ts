import request from '@/app/utils/Axiosconfig';
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
