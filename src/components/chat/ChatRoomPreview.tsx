import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatRoomPreviewProps } from '@/app/types/chat.type';
import { formatMessageTime } from '@/app/helpers/formatTimeAgo';

export function ChatRoomPreview({ chat, isActive }: ChatRoomPreviewProps) {
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
            alt={`${chat.username}'s profile`}
          />
          <AvatarFallback className="bg-[#ebebeb] dark:bg-[#313131]">
            {chat.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="truncate font-medium">{chat.username}</h2>
          <span className="ml-1 flex-shrink-0 text-xs text-gray-500">
            {chat.updated_at ? formatMessageTime(chat.updated_at) : ''}
          </span>
        </div>

        <p className="truncate text-xs text-gray-500">
          {chat.lastMessage || 'No messages yet'}
        </p>
      </div>
    </div>
  );
}
