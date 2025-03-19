import request from '@/app/utils/Axiosconfig';

export const getConversations = async () => {
  const response = await request({
    method: 'get',
    url: `/conversations`,
  });
  return response?.data;
};

export const getChat = async ({
  currentChatUserId,
  limit = 20,
  conversationId,
  nextMessageId,
}: {
  currentChatUserId: string;
  limit?: number;
  conversationId?: string;
  nextMessageId?: string;
}) => {
  const params = new URLSearchParams();
  params.append('otherUserId', currentChatUserId);
  params.append('limit', limit.toString());

  if (conversationId) params.append('conversationId', conversationId);
  if (nextMessageId) params.append('nextMessageId', nextMessageId);

  const response = await request({
    method: 'get',
    url: `/conversations/chat?${params.toString()}`,
  });

  return response?.data;
};

export const getUnreadMessagesCount = async () => {
  const response = await request({
    method: 'get',
    url: `/conversations/unread-messages/count`,
  });
  return response?.data;
};

export const markConversationAsRead = async (conversationId: string) => {
  await request({
    method: 'put',
    url: `/conversations/${conversationId}/mark-read`,
  });
};
