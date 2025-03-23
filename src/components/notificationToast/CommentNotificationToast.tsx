import { useUserApp } from '@/app/contexts/UserAppContext';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const { setUnreadNotificationsCount } = useUserApp();

  const linkUrl =
    type === 'comment-post'
      ? `/feed/post/${feedId}`
      : `/feed/challenge/${feedId}`;

  const handleClick = () => {
    router.push(linkUrl);
    console.log(linkUrl);
    setUnreadNotificationsCount((pre) => pre - 1);
  };
  return (
    <div
      className="flex min-w-[300px] flex-col gap-3 p-2"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex-shrink-0">
            <Image
              height={0}
              width={0}
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
              ? `Commented on your "#${hashtag}" post`
              : `Commented on your "#${hashtag}" challenge`}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-md p-2 text-sm italic">
        {commentContent.length > 60
          ? `${commentContent.substring(0, 60)}...`
          : commentContent}
      </div>
    </div>
  );
};
