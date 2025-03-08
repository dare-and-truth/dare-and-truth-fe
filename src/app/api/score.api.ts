import request from "@/app/utils/Axiosconfig";

export const getScoreByUserId = async (userId: string) => {
  try {
    const response = await request({
      method: 'get',
      url: `/scores/monster/${userId}`,
    });
    return response?.data;
  } catch (error) {
    console.error('Error in get user detail :', error);
    throw error;
  }
};
