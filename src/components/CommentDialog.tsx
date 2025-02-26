'use client';
import { getCommentsByFeedId } from '@/app/api/comment.api';
import { FeedType } from '@/app/types';
import Comment from '@/components/Comment';
import FeedContent from '@/components/FeedContent';
import CommentForm from '@/components/form/CommentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function CommentDialog({
  isCommentOpen,
  setIsCommentOpen,
  setCommentCount,
  feed,
}: {
  isCommentOpen: boolean;
  setIsCommentOpen: Dispatch<SetStateAction<boolean>>;
  setCommentCount: Dispatch<SetStateAction<number>>;
  feed: FeedType;
}) {
  const [comments, setComments] = useState([]);
  const [loadComment, setLoadComment] = useState(false);

  useEffect(() => {
    // Chỉ fetch dữ liệu khi dialog đang mở
    if (isCommentOpen) {
      const fetchComments = async () => {
        try {
          const comments = await getCommentsByFeedId(feed.id);
          if (feed) {
            setComments(comments);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
      fetchComments();
    }
  }, [isCommentOpen, loadComment, feed.id]); // Thêm isCommentOpen và feed.id vào dependency array

  return (
    <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
      <DialogContent className="flex h-[95vh] max-w-2xl flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="text-center">
            {feed.username} - #{feed.hashtag}
          </DialogTitle>
        </DialogHeader>

        <div className="scrollbar min-h-0 flex-1 overflow-y-auto border-t-2">
          {/* Post Content */}
          <div className="space-y-4">
            <FeedContent feed={feed} />

            {/* Comments Section */}
            <div className="space-y-2 border-t-2 pt-2">
              {comments.map((comment: any) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-none border-t pt-4">
          <CommentForm
            feedId={feed.id}
            isChallenge={feed.type === 'challenge'}
            setLoadComment={setLoadComment}
            setCommentCount={setCommentCount}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
