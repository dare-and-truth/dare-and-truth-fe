'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getRepliesByCommentId } from '@/app/api/comment.api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FaEdit, FaTrash, FaEllipsisH, FaPaperPlane } from 'react-icons/fa';
import { CommentType } from '@/app/types';
import Link from 'next/link';
import { renderTextWithLinks } from '@/app/helpers/renderTextWithLinks';
import { ExpandedModal } from './ExpandedModal';
import { PencilIcon } from 'lucide-react';

type CommentProps = {
  comment: CommentType;
  onReply: (parentCommentId?: string, username?: string) => void; // Xác định kiểu dữ liệu chính xác
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  avatarUrl: string;
  feedUserId?: string;
  loadComment: boolean;
  setLoadComment: Dispatch<SetStateAction<boolean>>;
};

export default function CommentComponent({
  comment,
  onUpdate,
  onDelete,
  onReply,
  avatarUrl,
  feedUserId,
  loadComment,
  setLoadComment,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 🆕 State để lưu reply comments
  const [replyComments, setReplyComments] = useState<any[]>([]);
  const [isReplyVisible, setIsReplyVisible] = useState(false); // Điều khiển hiển thị reply
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userAvatar = avatarUrl?.trim()
    ? avatarUrl
    : '/images/default-profile.png';
  const isVideo =
    comment.mediaUrl?.endsWith('.mp4') || comment.mediaUrl?.endsWith('.webm');
  // 🆕 Gọi API lấy comment reply khi mở comment cha
  useEffect(() => {
    if (!isReplyVisible) return;

    const fetchReplyComments = async () => {
      setLoadingReplies(true);
      try {
        const replyData = await getRepliesByCommentId(comment.id);

        // Lưu vào cả hai state nếu cần
        setReplyComments(replyData);
        setReplies(
          replyData.map((reply) => ({ ...reply, level: reply.level })),
        );
        setLoadComment(true);
      } catch (error) {
        console.error('Error fetching reply comments:', error);
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchReplyComments();
  }, [isReplyVisible, comment.id, loadComment]);

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setDeleteId(commentId);
    setShowDeleteDialog(true);
  };

  const handleReplyComment = (parentCommentId?: string, username?: string) => {
    if (isReplying) {
      // Nếu đang mở form reply, nhấn thêm lần nữa thì không truyền parent
      onReply(undefined, undefined);
    } else {
      // Nếu đang đóng form, nhấn sẽ truyền parent
      onReply(parentCommentId, username);
    }
    setIsReplying(!isReplying); // Luôn giữ form mở khi cần
  };
  // ✏️ Gọi hàm onUpdate từ props
  const handleUpdate = () => {
    if (!editedContent.trim()) return;
    onUpdate(comment.id, editedContent);
    comment.content = editedContent;
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log("feeeuddeid và cmmtuser id",feedUserId,"cmt",comment.user.id);
  return (
    <div>
      {/* Comment Cha */}
      <div className="flex items-start gap-2">
        {/* Avatar */}

        <Link
          href={`/profile/${comment.user.id}`}
          className="relative h-14 w-14"
        >
          <Image
            alt="User avatar"
            className={`rounded-full object-cover sm:h-10 sm:w-10 ${
              comment.user.id === feedUserId
                ? 'border-gradient  sm:h-11 sm:w-11'
                : 'sm:h-10 sm:w-10'
            }`}
            src={userAvatar}
            width={0}
            height={0}
          />
        </Link>
        {/* Nội dung bình luận */}
        <div className="flex w-full max-w-[85%] items-start justify-between">
          <div className="w-[95%] flex-col">
            <div className="bg-muted w-[100%] rounded-lg bg-slate-100 p-2">
              {isEditing ? (
                <div className="flex w-full items-center">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 resize-none rounded border p-1"
                    rows={3}
                  />
                  <div className="ml-2 flex items-center">
                    <button onClick={handleUpdate} className="text-blue-500">
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex items-center text-sm font-semibold">
                    {comment.user.username}
                    {comment.user.id === feedUserId && (
                      <span className="ml-2 flex items-center gap-1 text-[13px] text-gray-300">
                        Author <PencilIcon size={12} />
                      </span>
                    )}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {renderTextWithLinks(comment.content?.trim())}
                  </p>
                  {comment.mediaUrl && (
                    <div className="mt-2">
                      {isVideo ? (
                        <video
                          src={comment.mediaUrl}
                          className="h-24 w-24 cursor-pointer rounded object-cover"
                          onClick={() => setIsVideoPlaying(true)}
                        />
                      ) : (
                        <Image
                          src={
                            comment.mediaUrl || '/images/placeholder-image.png'
                          }
                          alt="Comment media"
                          width={96}
                          height={96}
                          className="h-24 w-24 cursor-pointer rounded object-cover"
                          onClick={() => setIsVideoPlaying(true)}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="ml-16 mt-1 flex items-center justify-end gap-x-4">
              {/* Nút See Replies */}
              {comment.numberOfReplies > 0 && (
                <button
                  onClick={() => setIsReplyVisible((prev) => !prev)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {isReplyVisible
                    ? 'Hide replies'
                    : `See ${comment.numberOfReplies} ${comment.numberOfReplies === 1 ? 'reply' : 'replies'}`}
                </button>
              )}

              {/* Nút Reply (chỉ hiển thị nếu không phải đang edit) */}
              {!isEditing && comment.level < 3 && (
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() =>
                    handleReplyComment(comment.id, comment.user.username)
                  }
                >
                  {isReplying ? 'Cancel' : 'Reply'}
                </button>
              )}
            </div>
            <div className="flex justify-end">
              {isEditing && (
                <div className="flex items-center">
                  <button
                    onClick={handleCancelEdit}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🆕 Nút hành động nếu là user của comment */}
          {comment.user.id === currentUserId && (
            <div className="relative ml-2">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <FaEllipsisH />
              </button>

              {showActions && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-6 z-50 w-20 rounded bg-white p-1 text-sm shadow-md"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                    className="flex items-center gap-1 p-1 text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="flex items-center gap-1 p-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🆕 Comment Reply - Hiển thị nếu có */}
      {isReplyVisible &&
        Array.isArray(replyComments) &&
        replyComments.length > 0 && (
          <div className="ml-10 mt-2 border-l-2 border-gray-300 pl-3">
            {replyComments.map((reply) => (
              <CommentComponent
                key={reply.id}
                comment={reply}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onReply={onReply}
                avatarUrl={
                  reply.user?.avatarUrl?.trim()
                    ? reply.user.avatarUrl
                    : '/images/default-profile.png'
                }
                feedUserId={feedUserId}
                setLoadComment={setLoadComment}
                loadComment={loadComment}
              />
            ))}
          </div>
        )}

      {/* 🆕 Confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md text-center">
          <DialogTitle>Confirm Delete Comment</DialogTitle>
          <p>Are you sure you want to delete this comment?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </button>
            <button
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {isVideoPlaying && (
        <ExpandedModal
          fileType={isVideo ? 'video' : 'image'}
          previewUrl={comment.mediaUrl!}
          onClose={() => setIsVideoPlaying(false)}
        />
      )}
    </div>
  );
}
