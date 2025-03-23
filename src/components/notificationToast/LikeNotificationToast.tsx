import { useUserApp } from '@/app/contexts/UserAppContext';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CommentToastProps {
  name: string;
  avatarUrl: string;
  hashtag: string;
  type: string;
  feedId: string;
}

export const LikeNotificationToast = ({
  name,
  avatarUrl,
  hashtag,
  type,
  feedId,
}: CommentToastProps) => {
  const router = useRouter();
  const { setUnreadNotificationsCount } = useUserApp();

  const linkUrl =
    type === 'like-post' ? `/feed/post/${feedId}` : `/feed/challenge/${feedId}`;

  const handleClick = () => {
    router.push(linkUrl);
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
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-red-500 bg-red-500 p-0.5">
            <Heart className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            {type === 'like-post'
              ? `Love your "#${hashtag}" post`
              : `Love your "#${hashtag}" challenge`}
          </p>
        </div>
      </div>
    </div>
  );
};
