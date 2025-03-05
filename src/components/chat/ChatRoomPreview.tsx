import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTime } from '@/lib/format-time';
import { ChatRoomPreviewProps } from '@/app/types/chat.type';

export function ChatRoomPreview({
  chat,
  isActive,
  userId,
}: ChatRoomPreviewProps) {
  const hasNewMessage = `${userId} NewMessage`;
  return (
    <div
      className={`${
        isActive
          ? 'bg-[#efefef] dark:bg-[#070707]'
          : 'hover:bg-[#f8f8f8] dark:hover:bg-[#131313]'
      } flex w-full items-center px-3 py-3 md:px-5`}
    >
      <div className="mr-3 flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={chat.avatarURL || ''}
            alt={`${chat.userName}'s profile`}
          />
          <AvatarFallback className="bg-[#ebebeb] dark:bg-[#313131]">
            {chat.userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="truncate font-medium">{chat.userName}</h2>
          <span className="ml-1 flex-shrink-0 text-xs text-gray-500">
            {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
          </span>
        </div>

        <div className="flex items-center">
          <p className="truncate text-xs text-gray-500">
            {chat.lastMessage || 'No messages yet'}
          </p>
          {hasNewMessage && (
            <div
              className="ml-2 h-2 w-2 rounded-full bg-[#0095f6]"
              aria-label="New message"
            />
          )}
        </div>
      </div>
    </div>
  );
}
