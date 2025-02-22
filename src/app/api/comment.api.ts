import { CreateCommentPayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const getCommentsByFeedId = async (feedId: string) => {
  const response = await request({
    method: 'get',
    url: `/comments/feed/${feedId}`,
  });
  return response?.data;
};

export const postComment = async (
  data: CreateCommentPayload,
  handleSuccess: () => void,
) => {
  await request({
    method: 'post',
    url: '/comments',
    data,
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      console.log('error in create post', error);
    },
  });
};
