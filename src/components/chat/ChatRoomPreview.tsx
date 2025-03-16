import { ChatRoomPreviewProps } from '@/app/types/chat.type';
import { formatMessageTime } from '@/app/helpers/formatTimeAgo';
import Image from 'next/image';

export function ChatRoomPreview({
  chat,
  isActive,
  otherUser,
}: ChatRoomPreviewProps) {
  return (
    <div
      className={`${
        isActive
          ? 'bg-[#efefef] dark:bg-[#070707]'
          : 'hover:bg-[#f8f8f8] dark:hover:bg-[#131313]'
      } flex w-full items-center px-3 py-3 md:px-5 ${chat.unreadMessages > 0 ? 'bg-slate-200' : ''}`}
    >
      <div className="relative mr-3 flex-shrink-0">
        <Image
          alt={otherUser.avatarUrl + ' avatar'}
          className="rounded-full object-cover sm:h-14 sm:w-14 h-12 w-12"
          src={
            otherUser.avatarUrl
              ? otherUser.avatarUrl.trim()
              : '/images/default-profile.png'
          }
          width={100}
          height={100}
        />

        {chat.unreadMessages > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {chat.unreadMessages > 9 ? '9+' : chat.unreadMessages}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h2
            className={`truncate ${chat.unreadMessages > 0 ? 'font-bold' : 'font-medium'}`}
          >
            {otherUser.username}
          </h2>
        </div>

        <p
          className={`truncate text-sm ${chat.unreadMessages > 0 ? 'font-medium text-foreground' : 'text-gray-500'}`}
        >
          {chat.lastMessage.senderId === otherUser.id ? '' : 'You: '}{' '}
          {chat.lastMessage.content === null ? 'Sent an image' : chat.lastMessage.content}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <span
            className={`flex-shrink-0 text-xs ${chat.unreadMessages > 0 ? 'text-foreground' : 'text-gray-500'}`}
          >
            {chat.updatedAt ? formatMessageTime(chat.updatedAt) : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
