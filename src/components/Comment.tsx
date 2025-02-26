'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function CommentComponent({ comment }: any) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const isVideo =
    comment.mediaUrl?.endsWith('.mp4') || comment.mediaUrl?.endsWith('.webm');

  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.user?.avatar} alt={comment.user.username} />
        <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg bg-slate-100 p-2">
          <p className="text-sm font-semibold">{comment.user.username}</p>
          <p className="text-sm">{comment.content}</p>
          {comment.mediaUrl && (
            <div className="mt-2">
              {isVideo ? (
                <video
                  src={comment.mediaUrl}
                  className="h-24 w-24 cursor-pointer rounded object-cover"
                  onClick={() => setIsVideoPlaying(true)}
                />
              ) : (
                <Dialog>
                  <DialogTrigger>
                    <Image
                      src={comment.mediaUrl || '/public/images/placeholder-image.png'}
                      alt="Comment media"
                      width={96}
                      height={96}
                      className="h-24 w-24 cursor-pointer rounded object-cover"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogTitle />
                    <Image
                      src={comment.mediaUrl || '/placeholder.svg'}
                      alt="Comment media"
                      width={800}
                      height={600}
                      className="h-auto w-full object-contain"
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </div>
      {isVideo && isVideoPlaying && (
        <Dialog open={isVideoPlaying} onOpenChange={setIsVideoPlaying}>
          <DialogContent className="max-w-3xl">
            <DialogTitle />
            <video
              src={comment.mediaUrl}
              className="h-auto w-full"
              controls
              autoPlay
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
