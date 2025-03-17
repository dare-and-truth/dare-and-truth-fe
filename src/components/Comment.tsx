'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getRepliesByCommentId } from '@/app/api/comment.api';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaEdit, FaTrash, FaEllipsisH, FaPaperPlane } from 'react-icons/fa';
import { CommentType } from '@/app/types';
import { FilePreview } from './FilePreview';
import Link from 'next/link';
import { renderTextWithLinks } from '@/app/helpers/renderTextWithLinks';
import { ExpandedModal } from './ExpandedModal';
import { PencilIcon } from 'lucide-react';

type CommentProps = {
  comment: CommentType;
  onReply: (parentCommentId?: string, username?:string) => void; // Xác định kiểu dữ liệu chính xác
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  avatarUrl: string;
  feedUserId?:string;
};

export default function CommentComponent({ comment, onUpdate, onDelete, onReply,avatarUrl,feedUserId }: CommentProps) {
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
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userAvatar = avatarUrl?.trim() ? avatarUrl : '/images/default-profile.png';
  const isVideo =
  comment.mediaUrl?.endsWith('.mp4') || comment.mediaUrl?.endsWith('.webm');
  // 🆕 Gọi API lấy comment reply khi mở comment cha
  useEffect(() => {
    if (!isReplyVisible) return;
  
    const fetchReplyComments = async () => {
      try {
        setLoadingReplies(true);
        const replyData = await getRepliesByCommentId(comment.id);
        
        // Lưu vào cả hai state nếu cần
        setReplyComments(replyData);
        setReplies(replyData.map(reply => ({ ...reply, level: reply.level })));
  
      } catch (error) {
        console.error('Error fetching reply comments:', error);
      } finally {
        setLoadingReplies(false);
      }
    };
  
    fetchReplyComments();
  }, [isReplyVisible, comment.id]);
  
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
    if (isReplyVisible) {
      // Nếu đang mở form reply, nhấn thêm lần nữa thì không truyền parent
      onReply(undefined, undefined);
    } else {
      // Nếu đang đóng form, nhấn sẽ truyền parent
      onReply(parentCommentId, username);
    }
    setIsReplyVisible(!isReplyVisible); // Luôn giữ form mở khi cần
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

  return (
    <div>
      {/* Comment Cha */}
      <div className="flex items-start gap-2">
        {/* Avatar */}
       
        <Link href={`/profile/${comment.user.id}`} className="w-14 h-14 relative">
          <Image
            alt="User avatar"
            className={`rounded-full object-cover sm:h-10 sm:w-10${
              comment.user.id === feedUserId ? ' border-gradient sm:h-11 sm:w-11' : 'sm:h-10 sm:w-10'
            }`}
            src={userAvatar}
            width={0}
            height={0}
          />
        </Link>
        {/* Nội dung bình luận */}
        <div className="flex items-start justify-between w-full">
          <div className="flex-col w-[95%]">
            <div className="bg-muted rounded-lg bg-slate-100 p-2 w-[100%]">
              {isEditing ? (
                <div className="flex items-center w-full">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border rounded p-1 flex-1 resize-none"
                    rows={3}
                  />
                  <div className="flex items-center ml-2">
                    <button onClick={handleUpdate} className="text-blue-500">
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold flex items-center">
                  {comment.user.username}
                  {comment.user.id === feedUserId && (
                    <span className="text-gray-300 text-[13px] ml-2 flex items-center gap-1">
                      Author <PencilIcon size={12} />
                    </span>
                  )}
                </p>
                <p className="whitespace-pre-wrap text-sm">
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
                      src={comment.mediaUrl || '/images/placeholder-image.png'}
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

            <div className="flex items-center justify-end gap-x-4 ml-16 mt-1">
              {/* Nút See Replies */}
              {comment.numberOfReplies > 0 && (
                <button
                  onClick={() => setIsReplyVisible((prev) => !prev)}
                  className="text-blue-500 text-sm hover:underline"
                >
                  {isReplyVisible
                    ? 'Hide replies'
                    : `See ${comment.numberOfReplies} ${comment.numberOfReplies === 1 ? 'reply' : 'replies'}`}
                </button>
              )}

              {/* Nút Reply (chỉ hiển thị nếu không phải đang edit) */}
              {!isEditing && comment.level < 3 && (
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={() => handleReplyComment(comment.id, comment.user.username)}
                >
                  Reply
                </button>
              )}
            </div>
            <div className="flex justify-end">
              {isEditing && (
                <div className="flex items-center">
                  <button
                    onClick={handleCancelEdit}
                    className=" text-blue-400 hover:text-blue-500 "
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
                <div ref={menuRef} className="absolute top-6 right-0 bg-white shadow-md rounded p-1 w-20 text-sm z-50">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 p-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 p-1"
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
      {isReplyVisible && Array.isArray(replyComments) && replyComments.length > 0 && (
      <div className="ml-10 mt-2 border-l-2 border-gray-300 pl-3">
        {replyComments.map((reply) => (
          <CommentComponent
            key={reply.id}
            comment={reply}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onReply={onReply}
            avatarUrl={reply.user?.avatarUrl?.trim() ? reply.user.avatarUrl : '/images/default-profile.png'}
            feedUserId={feedUserId}
          />
        ))
        }
      </div>
      )}
    

      {/* 🆕 Confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md text-center">
          <DialogTitle>Confirm Delete Comment</DialogTitle>
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-300"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {isVideoPlaying && (
        <ExpandedModal
          fileType={isVideo?"video":"image"}
          previewUrl={comment.mediaUrl!}
          onClose={() => setIsVideoPlaying(false)}
        />
      )}
    </div>
  );
}
