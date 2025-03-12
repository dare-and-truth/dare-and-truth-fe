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
  lastMessageId,
}: {
  otherUserId: string;
  limit?: number;
  conversationId?: string;
  lastMessageId?: string;
}) => {
  const params = new URLSearchParams();
  params.append('otherUserId', otherUserId);
  params.append('limit', limit.toString());

  if (conversationId) params.append('conversationId', conversationId);
  if (lastMessageId) params.append('lastMessageId', lastMessageId);

  const response = await request({
    method: 'get',
    url: `/conversations/chat?${params.toString()}`,
  });

  return response?.data;
};
