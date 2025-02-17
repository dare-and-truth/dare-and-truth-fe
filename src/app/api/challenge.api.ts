import { CreateChallengePayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const getChallenges = async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/challenges',
    });
    return response?.data;
  } catch (error) {
    console.error('Error in get challenges:', error);
    throw error;
  }
};

export const postChallenge = async (
  data: CreateChallengePayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'post',
    url: '/challenges',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.log('error in create challenge', error);
    },
  });
};
