import { LikePayload, unlikeFeedPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const likeFeed = async (
  data: LikePayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'post',
    url: '/likes',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.log('error in like feed', error);
    },
  });
};

export const unlikeFeed = async (
  data: unlikeFeedPayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'delete',
    url: '/likes',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.log('error in unlike feed', error);
    },
  });
};
