import { SendMessagePayload } from '@/app/types';
import request from '@/app/utils/Axiosconfig';

export const sendMessage = async (data: SendMessagePayload) => {
  await request({
    method: 'post',
    url: '/messages/send',
    data,
  });
};

export const markReadConversation = async (conversationId: string) => {
  await request({
    method: 'put',
    url: `/messages/${conversationId}/mark-read`,
  });
};