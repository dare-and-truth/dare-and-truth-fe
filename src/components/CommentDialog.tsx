'use client';
import { getCommentsByFeedId } from '@/app/api/comment.api';
import Comment from '@/components/Comment';
import FeedContent from '@/components/FeedContent';
import CommentForm from '@/components/form/CommentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
export default function CommentDialog({
  isCommentOpen,
  setIsCommentOpen,
  challenge,
}: any) {
  const [comments, setComments] = useState([]);
  const [loadComment, setLoadComment] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getCommentsByFeedId(challenge.id);
        if (challenge) {
          setComments(comments);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };
    fetchComments();
  }, [loadComment]);

  return (
    <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
      <DialogContent className="flex h-[95vh] max-w-2xl flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="text-center">
            {challenge.username} - #{challenge.hashtag}
          </DialogTitle>
        </DialogHeader>

        <div className="scrollbar min-h-0 flex-1 overflow-y-auto border-t-2">
          {/* Post Content */}
          <div className="space-y-4">
            <FeedContent challenge={challenge} />

            {/* Comments Section */}
            <div className="space-y-2 border-t-2 pt-2">
              {comments.map((comment: any) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-none border-t pt-4">
          <CommentForm feedId={challenge.id} setLoadComment={setLoadComment} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
