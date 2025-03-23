import { SendMessagePayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const sendMessage = async (data: SendMessagePayload) => {
  const res = await request({
    method: 'post',
    url: '/messages/send',
    data,
  });
  return res.data;
};
