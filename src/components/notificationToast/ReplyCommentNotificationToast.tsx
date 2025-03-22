import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserApp } from '@/app/contexts/UserAppContext';

interface ReplyCommentNotificationProps {
  type: string;
  name: string;
  avatarUrl: string;
  hashtag: string;
  feedId: string;
  commentContent: string;
  parentCommentId: string;
}

export const ReplyCommentNotificationToast: React.FC<
  ReplyCommentNotificationProps
> = ({
  type,
  name,
  avatarUrl,
  hashtag,
  feedId,
  commentContent,
  parentCommentId,
}) => {
  // Determine the correct link based on the type
  const router = useRouter();
  const { setUnreadNotificationsCount } = useUserApp();

  const linkUrl =
    type === 'reply-comment-post'
      ? `/feed/post/${feedId}`
      : `/feed/challenge/${feedId}`;

  const handleClick = () => {
    router.push(linkUrl);
    setUnreadNotificationsCount((pre) => pre - 1);
  };
  return (
    <div onClick={handleClick}>
      <div className="flex min-w-[300px] flex-col gap-3 p-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex-shrink-0">
              <img
                src={avatarUrl || '/images/default-profile.png'}
                alt="User Avatar"
                className="h-12 w-12 rounded-full object-cover"
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
                ? `Reply your comment on "#${hashtag}" post`
                : `Reply your comment on "#${hashtag}" challenge`}
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
    </div>
  );
};
