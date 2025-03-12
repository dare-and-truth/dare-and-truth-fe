  import request from "@/app/utils/Axiosconfig";

  export const getAllRanking = async () => {
    try {
      const response = await request({
        method: 'get',
        url: '/ranks',
      });
      return response?.data;
    } catch (error) {
      console.error('Error in get ranking', error);
      throw error;
    }
  };


  export const geChallengeRanking = async (challengeId:string) => {
    try {
      const response = await request({
        method: 'get',
        url: `/ranks/challenge/${challengeId}`,
      });
      return response?.data;
    } catch (error) {
      console.error('Error in get ranking', error);
      throw error;
    }
  };
