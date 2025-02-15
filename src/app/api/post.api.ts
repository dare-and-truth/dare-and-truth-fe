import request from "@/app/utils/Axiosconfig";

export const getPost = async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/posts',
    });
    return response?.data;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
};
