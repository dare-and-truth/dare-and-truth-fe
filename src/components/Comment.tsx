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

  // Kiểm tra avatar: nếu avatar tồn tại và không phải chuỗi rỗng (sau khi trim), dùng nó, nếu không thì dùng ảnh default
  const userAvatar =
    comment.user?.avatarUrl && comment.user.avatarUrl.trim() !== ""
      ? comment.user.avatarUrl
      : "/images/default-profile.png";

  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={userAvatar}
          alt={comment.user.username}
          className="object-cover"
        />
        <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg bg-slate-100 p-2">
          <p className="text-sm font-semibold">{comment.user.username}</p>
          <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
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
                      src={comment.mediaUrl || '/images/placeholder-image.png'}
                      alt="Comment media"
                      width={96}
                      height={96}
                      className="h-24 w-24 cursor-pointer rounded object-cover"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogTitle />
                    <Image
                      src={comment.mediaUrl || '/images/placeholder.svg'}
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
