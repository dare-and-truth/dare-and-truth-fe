import request from '@/app/utils/Axiosconfig';

export const getConversations = async () => {
  const response = await request({
    method: 'get',
    url: `/conversations`,
  });
  return response?.data;
};

export const getChat = async ({
  otherUserId,
  limit = 20,
  conversationId,
  nextMessageId,
}: {
  otherUserId: string;
  limit?: number;
  conversationId?: string;
  nextMessageId?: string;
}) => {
  const params = new URLSearchParams();
  params.append('otherUserId', otherUserId);
  params.append('limit', limit.toString());

  if (conversationId) params.append('conversationId', conversationId);
  if (nextMessageId) params.append('nextMessageId', nextMessageId);

  const response = await request({
    method: 'get',
    url: `/conversations/chat?${params.toString()}`,
  });

  return response?.data;
};
