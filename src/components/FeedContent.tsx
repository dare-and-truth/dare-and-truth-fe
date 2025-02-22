import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/app/helpers/formatTimeAgo';
import { Button } from '@/components/ui/button';
import { IPropsChallenge } from '@/app/types';

const isVideo = (mediaUrl: string) => {
  return mediaUrl?.match(/\.(mp4|webm|ogg)$/i);
};

export default function FeedContent({ challenge }: IPropsChallenge) {
  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 align-middle">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/images/default-profile.png" />
            <AvatarFallback>Linh</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{challenge.username}</h4>
            <p className="text-muted-foreground text-sm">
              {formatTimeAgo(challenge.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="join">Join</Button>
      </div>

      <div className="mb-4">
        <p className="font-bold text-blue-500">#{challenge.hashtag}</p>
        <span className="font-bold">Starting: </span>
        <span>
          {challenge.startDate} - {challenge.endDate}
        </span>
        <p>{challenge.content}</p>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg">
        {isVideo(challenge.mediaUrl) ? (
          <video
            src={challenge.mediaUrl}
            controls
            className="w-full"
            style={{ maxHeight: '400px' }}
          />
        ) : (
          <Image
            src={challenge.mediaUrl}
            alt="Challenge media"
            width={0}
            height={10}
            layout="responsive"
            objectFit="cover"
          />
        )}
      </div>
    </>
  );
}
