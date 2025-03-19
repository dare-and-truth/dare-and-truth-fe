'use client';
import {
  deleteComment,
  getCommentsByFeedId,
  updateComment,
} from '@/app/api/comment.api';
import { CommentType, FeedType } from '@/app/types';
import CommentComponent from '@/components/Comment';
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
import { toast } from 'react-toastify';

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
  const [loadComment, setLoadComment] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null,
  );
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    // Chỉ fetch dữ liệu khi dialog đang mở
    if (isCommentOpen) {
      const fetchComments = async () => {
        try {
          const comments = await getCommentsByFeedId(feed.id, feed.userId);
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

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await updateComment({ content }, commentId, () => {
        setLoadComment(true);
        toast.success('Updated comment successfully');
        setLoadComment((prev) => !prev);
      });
    } catch (error) {
      toast.error('Update comment failed');
      console.error('Update comment failed', error);
    }
  };

  // 🗑 Hàm xóa bình luận
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId, () => {
        toast.success('Delete Comment successfully');
        setLoadComment((prev) => !prev);
      });
    } catch (error) {
      toast.error('Delete Comment failed');
    }
  };

  const handleReplyComment = (parentCommentId?: string, username?: string) => {
    setSelectedComment({
      parentCommentId: parentCommentId,
      user: { username },
    } as CommentType);
    setShowReplyForm(true);
  };

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
              {comments.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  onReply={handleReplyComment}
                  avatarUrl={
                    comment.user?.avatarUrl?.trim()
                      ? comment.user.avatarUrl
                      : '/images/default-profile.png'
                  }
                  feedUserId={feed.userId}
                  loadComment={loadComment}
                  setLoadComment={setLoadComment}
                />
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
            parentCommentId={
              showReplyForm
                ? (selectedComment?.parentCommentId ?? undefined)
                : undefined
            }
            username={
              showReplyForm ? selectedComment?.user?.username : undefined
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
