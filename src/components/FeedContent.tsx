'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/app/helpers/formatTimeAgo';
import { Button } from '@/components/ui/button';
import { FeedType } from '@/app/types';
import { JoinChallengeDialog } from '@/components/JoinChallengeDialog';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPostByHashtag } from '@/app/api/post.api';

const isVideo = (mediaUrl: string) => {
  return mediaUrl?.match(/\.(mp4|webm|ogg)$/i);
};

export default function FeedContent({ feed }: { feed: FeedType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(feed.joined);
  const [startDay, setStartDate] = useState('');
  const [endDay, setEndDate] = useState('');
  const today = new Date();
  const endDate = new Date(feed.endDate);
  const isExpired = endDate < today;

  // Create a helper variable to decide the avatar URL
  const avatarUrl =
    feed.avatarUrl && feed.avatarUrl.trim() !== ''
      ? feed.avatarUrl
      : '/images/default-profile.png';

  useEffect(() => {
    if (feed.type == 'post') {
      const fetchDates = async () => {
        try {
          const response = await getPostByHashtag(feed.hashtag, feed.createdAt);
          setStartDate(response.startDate);
          setEndDate(response.endDate);
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      };
      fetchDates();
    }
  }, [feed.hashtag, feed.createdAt, feed.type]);

  const queryParams =
    feed.type === 'challenge'
      ? `?startDate=${feed.startDate}&endDate=${feed.endDate}`
      : startDay && endDay
        ? `?startDate=${startDay}&endDate=${endDay}`
        : '';
  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 align-middle">
          <Link href={`/profile/${feed.userId}`}>
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback>{feed.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <h4 className="font-bold">{feed.username}</h4>
            <p className="text-muted-foreground text-sm">
              {formatTimeAgo(feed.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          {feed.type === 'challenge' && !isJoined && (
            <>
              <JoinChallengeDialog
                button={
                  <Button
                    variant="default"
                    className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400"
                    disabled={isExpired}
                  >
                    Join Challenge
                  </Button>
                }
                challenge={feed}
                setIsJoined={setIsJoined}
              />
              <Link
                href={`/ranking/${feed.id}`}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 transition-all hover:bg-blue-700"
              >
                <Image
                  src="/images/award.png"
                  alt="Award image"
                  height={28}
                  width={28}
                  className="object-cover"
                />
              </Link>
            </>
          )}

          {feed.type === 'challenge' && isJoined && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-blue-200 bg-blue-50 px-6 py-2 font-medium text-blue-600"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Joined
              </Button>
              <Link
                href={`/ranking/${feed.id}`}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 transition-all hover:bg-blue-700"
              >
                <Image
                  src="/images/award.png"
                  alt="Award image"
                  height={28}
                  width={28}
                  className="object-cover"
                />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Link
          href={`/hashtag/${feed.hashtag}${queryParams}`}
          className="font-bold text-blue-500"
        >
          #{feed.hashtag}
        </Link>
        {feed.type === 'challenge' && (
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
        <p className="whitespace-pre-wrap">{feed.content}</p>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg">
        {/* Dialog to show enlarged image/video */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {isVideo(feed.mediaUrl) ? (
              <video
                src={feed.mediaUrl}
                controls
                className="w-full cursor-pointer"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                onClick={() => setIsOpen(true)}
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
                }}
                onClick={() => setIsOpen(true)}
              />
            )}
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0">
            <DialogTitle />
            {isVideo(feed.mediaUrl) ? (
              <video
                src={feed.mediaUrl}
                controls
                autoPlay
                className="w-full"
                style={{ maxHeight: '95vh', objectFit: 'contain' }}
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
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
