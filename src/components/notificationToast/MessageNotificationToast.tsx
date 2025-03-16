import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MessageToastProps {
  message: any;
}

export const MessageNotificationToast = ({
  message
}: MessageToastProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/message?userId=${message.senderId.trim()}`);
  }
  return (
    <div
      onClick={handleClick}
      className="flex min-w-[300px] flex-col gap-3 p-2"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex-shrink-0">
            <img
              src={message.senderAvatarUrl || '/images/default-profile.png'}
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-blue-500 bg-blue-500 p-0.5">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <p className="font-medium">{message.senderUsername}</p>

          {message.content ? (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {message.content}
            </p>
          ) : (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              Sent you an image
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
