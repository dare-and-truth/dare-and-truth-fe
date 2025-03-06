import { Message } from '@/app/types';

export function shouldShowAvatar(
  messages: Message[] | undefined,
  index: number,
) {
  if (!messages) return true;
  if (index === 0) return true;
  return messages[index].senderId !== messages[index - 1].senderId;
}

export function shouldShowTimestamp(
  messages: Message[] | undefined,
  index: number,
) {
  if (!messages) return true;
  if (index === 0) return true;

  const currentMessage = messages[index];
  const nextMessage = messages[index + 1];
  return !nextMessage || nextMessage.senderId !== currentMessage.senderId;
}
