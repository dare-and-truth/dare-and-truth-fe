import { ChatRoom } from '@/app/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface ChatRoomPreviewProps {
  chatRoom: ChatRoom;
  isActive: boolean;
  username: string;
}

export function ChatRoomPreview({
  chatRoom,
  isActive,
  username,
}: ChatRoomPreviewProps) {
  const hasNewMessage = chatRoom[`${username}NewMessage`];

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
            src={chatRoom.avatarURL || ''}
            alt={`${chatRoom.chatName}'s profile`}
          />
          <AvatarFallback className="bg-[#ebebeb] dark:bg-[#313131]">
            {chatRoom.chatName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex-1 ">
        <div className="flex items-center justify-between">
          <h2 className="truncate font-medium">{chatRoom.chatName}</h2>
          <span className="ml-1 flex-shrink-0 text-xs text-gray-500">
            {chatRoom.lastMessageTime
              ? formatTime(chatRoom.lastMessageTime)
              : ''}
          </span>
        </div>

        <div className="flex items-center">
          <p className="truncate text-xs text-gray-500">
            {chatRoom.lastMessage || 'No messages yet'}
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

// Helper function to format time
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Within a week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
