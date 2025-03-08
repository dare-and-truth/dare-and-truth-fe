import { MessageSquare } from 'lucide-react';

interface CommentToastProps {
  name: string;
  avatarUrl: string;
  hashtag: string;
  type: string;
  feedId: string;
  commentContent: string;
}

export const CommentNotificationToast = ({
  name,
  avatarUrl,
  hashtag,
  type,
  feedId,
  commentContent,
}: CommentToastProps) => {
  return (
    <div className="flex min-w-[300px] flex-col gap-3 p-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex-shrink-0">
            <img
              src={avatarUrl || '/images/default-profile.png'}
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-green-500 bg-green-500 p-0.5">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            {type === 'comment-post'
              ? `Commented on your "#${hashtag}" post`
              : `Commented on your "#${hashtag}" challenge`}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-md p-2 text-sm italic">
        "
        {commentContent.length > 60
          ? `${commentContent.substring(0, 60)}...`
          : commentContent}
        "
      </div>
    </div>
  );
};
