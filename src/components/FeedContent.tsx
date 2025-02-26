'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/app/helpers/formatTimeAgo';
import { Button } from '@/components/ui/button';
import { FeedType } from '@/app/types';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

const isVideo = (mediaUrl: string) => {
  return mediaUrl?.match(/\.(mp4|webm|ogg)$/i);
};

export default function FeedContent({ feed }: { feed: FeedType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 align-middle">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/images/default-profile.png" />
            <AvatarFallback>Linh</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{feed.username}</h4>
            <p className="text-muted-foreground text-sm">
              {formatTimeAgo(feed.createdAt)}
            </p>
          </div>
        </div>
        {feed.type == 'challenge' && <Button variant="join">Join</Button>}
      </div>

      <div className="mb-4">
        <p className="font-bold text-blue-500">#{feed.hashtag}</p>
        {feed.type == 'challenge' && (
          <div>
            <p>
              <span className="font-bold">Start Date: </span>
              <span>{feed.startDate}</span>
            </p>
            <p>
              <span className="font-bold">End Date: </span>
              <span>{feed.endDate}</span>
            </p>
          </div>
        )}
        <p>{feed.content}</p>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg">
        {/* Dialog để hiển thị ảnh/video phóng to */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {/* Nội dung gốc với giới hạn chiều cao */}
            {isVideo(feed.mediaUrl) ? (
              <video
                src={feed.mediaUrl}
                controls
                className="w-full cursor-pointer"
                style={{ maxHeight: '400px', objectFit: 'cover' }} // Giới hạn chiều cao
                onClick={() => setIsOpen(true)} // Mở dialog khi nhấp
              />
            ) : (
              <Image
                src={feed.mediaUrl}
                alt="Challenge media"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full cursor-pointer"
                style={{
                  maxHeight: '400px',
                  height: 'auto',
                  objectFit: 'cover',
                }} // Giới hạn chiều cao
                onClick={() => setIsOpen(true)} // Mở dialog khi nhấp
              />
            )}
          </DialogTrigger>

          {/* Nội dung trong dialog khi phóng to */}
          <DialogContent className="max-w-3xl p-0">
            <DialogTitle/>
            {isVideo(feed.mediaUrl) ? (
              <video
                src={feed.mediaUrl}
                controls
                autoPlay
                className="w-full"
                style={{ maxHeight: '95vh', objectFit: 'contain' }} // Giới hạn trong dialog
              />
            ) : (
              <Image
                src={feed.mediaUrl}
                alt="Challenge media zoomed"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full"
                style={{
                  maxHeight: '80vh',
                  height: 'auto',
                  objectFit: 'contain',
                }} // Giới hạn trong dialog
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
