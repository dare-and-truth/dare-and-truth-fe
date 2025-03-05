import { formatMessageTime } from '@/app/helpers/formatTimeAgo';
import { MessageBubbleProps } from '@/app/types';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export function MessageBubble({
  message,
  isCurrentUser,
  avatarURL,
  showAvatar,
  showTimestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={`my-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && showAvatar ? (
        <div className="mr-2 mt-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarURL} alt="image/profile" />
          </Avatar>
        </div>
      ) : (
        !isCurrentUser && <div className="w-8" />
      )}
      <div className="flex max-w-[60%] flex-col md:max-w-[50%]">
        {message.imgUrl && (
          <img
            src={message.imgUrl}
            alt="Sent image"
            className="mb-2 max-w-full rounded-lg"
          />
        )}
        <div className="group flex flex-col">
          {message.content.trim() && (
            <div
              className={`${
                isCurrentUser
                  ? 'rounded rounded-tr-sm bg-blue-600 text-white dark:bg-[#070707]'
                  : 'rounded rounded-tl-sm border border-stone-200 bg-gray-100 dark:border-stone-700'
              } p-2 text-sm`}
            >
              {message.content}
            </div>
          )}

          {showTimestamp ? (
            <div
              className={`mt-1 text-xs text-gray-500 ${
                isCurrentUser ? 'text-right' : 'text-left'
              }`}
            >
              {formatMessageTime(message.updated_at)}
            </div>
          ) : (
            <div
              className={`mt-1 hidden text-xs text-gray-500 group-hover:block ${
                isCurrentUser ? 'text-right' : 'text-left'
              }`}
            >
              {formatMessageTime(message.updated_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
