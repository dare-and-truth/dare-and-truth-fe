'use client';
import { FeedType } from '@/app/types';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { likeFeed, unlikeFeed } from '@/app/api/like.api';
import { Button } from '@/components/ui/button';
import FeedContent from '@/components/FeedContent';
import CommentDialog from '@/components/CommentDialog';

export default function Feed({ feed }: {feed: FeedType}) {
  const [liked, setLiked] = useState(feed.liked);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const [commentCount, setCommentCount] = useState(feed.commentCount);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const handleLike = () => {
    if (liked) {
      unlikeFeed({ feedId: feed.id }, () => {
        setLikeCount((prev) => prev - 1);
        setLiked(!liked);
      });
    } else {
      likeFeed({ feedId: feed.id, isChallenge: feed.type === 'challenge' }, () => {
        setLikeCount((prev) => prev + 1);
        setLiked(!liked);
      });
    }
  };

  return (
    <div className="bg-card text-card-foreground mt-4 rounded-2xl border shadow-lg">
      <div className="p-6">
        <FeedContent feed={feed} />

        <div className="flex justify-between gap-6 border-t pt-2">
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 hover:bg-red-300"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                liked ? 'fill-red-500 stroke-red-500' : 'fill-none',
              )}
            />
            <span>
              {likeCount} {likeCount === 1 ? 'Love' : 'Loves'}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 hover:bg-orange-300"
            onClick={() => setIsCommentOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {commentCount}{' '}
              {commentCount === 1 ? 'Comment' : 'Comments'}
            </span>
          </Button>
          <Button variant="ghost" size="lg" className="gap-2 hover:bg-sky-300">
            <Share2 className="h-4 w-4" />
            <span>Shares</span>
          </Button>
        </div>
      </div>
      <CommentDialog
        isCommentOpen={isCommentOpen}
        setIsCommentOpen={setIsCommentOpen}
        setCommentCount={setCommentCount}
        feed={feed}
      />
    </div>
  );
}
