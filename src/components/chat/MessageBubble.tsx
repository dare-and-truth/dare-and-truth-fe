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
      {/* {!isCurrentUser && showAvatar ? (
        <div className="mr-2 mt-auto">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarURL} alt="image/profile" />
          </Avatar>
        </div>
      ) : (
        !isCurrentUser && <div className="w-14" />
      )} */}
      <div className="flex max-w-[60%] flex-col md:max-w-[50%]">
        {message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="Sent image"
            className="mb-2 max-w-full rounded-lg"
          />
        )}
        <div
          className={`group flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`w-fit max-w-[150%] break-words rounded-2xl px-4 py-2 text-sm ${
              isCurrentUser
                ? 'rounded-br-sm bg-blue-600 text-white dark:bg-zinc-800'
                : 'rounded-bl-sm border border-gray-200 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100'
            } `}
          >
            {message.content?.trim()}
          </div>
          {showTimestamp && (
            <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400`}>
              {formatMessageTime(message.sentAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
