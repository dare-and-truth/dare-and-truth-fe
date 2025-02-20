'use client';
import { IPropsChallenge } from '@/app/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Feed({ challenge }: IPropsChallenge) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(99);
  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };
  const isVideo = (mediaUrl: string) => {
    return mediaUrl?.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div
      key={challenge.id}
      className="bg-card text-card-foreground mt-4 rounded-2xl border shadow-lg"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/images/default-profile.png" />
              <AvatarFallback>Linh</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-bold">John Doe</h4>
              <p className="text-muted-foreground text-sm">2 days ago</p>
            </div>
          </div>
          <Button variant="join">Join</Button>
        </div>

        <div className="mb-4">
          <p className='text-blue-500 font-bold'># {challenge.hashtag}</p>
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

        <div className="flex justify-between gap-6 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                liked ? 'fill-red-500 stroke-red-500' : 'fill-none',
              )}
            />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>50 comments</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>66 Shares</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
