'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaEdit, FaTrash, FaEllipsisH, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CommentComponent({ comment, onUpdate, onDelete }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isVideo = comment.mediaUrl?.endsWith('.mp4') || comment.mediaUrl?.endsWith('.webm');
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userAvatar = comment.user?.avatarUrl?.trim() ? comment.user.avatarUrl : '/images/default-profile.png';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };
  
  const handleDeleteClick = (commentId: number) => {
    setDeleteId(commentId);
    setShowDeleteDialog(true);
  };
  
  // ✏️ Gọi hàm onUpdate từ props
  const handleUpdate = () => {
    if (!editedContent.trim()) return;
    onUpdate(comment.id, editedContent);
    comment.content = editedContent;
    setIsEditing(false);
  };

  // ❌ Hủy chỉnh sửa
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
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <Image
        alt="User avatar"
        className="rounded-full object-cover sm:h-14 sm:w-14"
        src={userAvatar}
        width={100}
        height={100}
      />

      {/* Nội dung bình luận */}
      <div className="flex items-start justify-between w-full">
        <div className="bg-muted rounded-lg bg-slate-100 p-2 w-[95%]">
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
              <p className="text-sm font-semibold">{comment.user.username}</p>
              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
            </>
          )}

          {/* Hiển thị hình ảnh/video nếu có */}
          {comment.mediaUrl && (
            <div className="mt-2">
              {isVideo ? (
                <video
                  src={comment.mediaUrl}
                  className="h-24 w-24 cursor-pointer rounded object-cover"
                  controls
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

        {/* 🆕 Hiển thị nút ba chấm nếu comment.user_id === currentUserId */}
        {comment.user.id === currentUserId && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <FaEllipsisH />
            </button>

            {/* Menu chỉnh sửa/xóa */}
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

            {/* Giữ UI gốc của bạn */}
            <div>
              {isEditing && (
                <div className="flex items-center mt-3">
                  <button
                    onClick={handleCancelEdit}
                    className="ml-1 text-blue-400 hover:text-blue-500 "
                  >
                    x Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Hiển thị video khi click */}
      {isVideo && isVideoPlaying && (
        <Dialog open={isVideoPlaying} onOpenChange={setIsVideoPlaying}>
          <DialogContent className="max-w-3xl">
            <DialogTitle />
            <video src={comment.mediaUrl} className="h-auto w-full" controls autoPlay />
          </DialogContent>
        </Dialog>
      )}

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
    </div>
  );
}
