import { MessageResponse } from '@/app/types';

export function shouldShowAvatar(
  messages: MessageResponse[] | undefined,
  index: number,
) {
  if (!messages) return true;
  if (index === 0) return true;
  return messages[index].senderId === messages[index - 1].senderId;
}

export function shouldShowTimestamp(
  messages: MessageResponse[] | undefined,
  index: number,
) {
  if (!messages) return true;
  if (index === 0) return true;

  const currentMessage = messages[index];
  const nextMessage = messages[index + 1];
  return !nextMessage || nextMessage.senderId !== currentMessage.senderId;
}
