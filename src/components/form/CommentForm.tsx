'use client';

import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Loader2, SendHorizontal, X } from 'lucide-react';
import { MAX_FILE_SIZE, VALID_FILE_TYPES } from '@/app/constants';
import { uploadFileToSupabase } from '@/app/helpers/uploadFileToSupabase';
import { getCommentById, postComment } from '@/app/api/comment.api';
import type { CreateCommentPayload } from '@/app/types';
import Image from 'next/image';

type FormErrors = {
  content?: string;
  file?: string;
};

export default function CommentForm({
  feedId,
  parentCommentId,
  isChallenge,
  setLoadComment,
  setCommentCount,
  username,
}: {
  feedId: string;
  parentCommentId?: string;
  isChallenge: boolean;
  setLoadComment: Dispatch<SetStateAction<boolean>>;
  setCommentCount: Dispatch<SetStateAction<number>>;
  username?:string;
}) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setUserAvatarUrl] = useState('/images/default-profile.png');

  useEffect(() => {
    const userAvatarUrl = localStorage.getItem('avatarUrl');
    if (
      userAvatarUrl &&
      userAvatarUrl.trim() !== 'null' &&
      userAvatarUrl.trim() !== ''
    ) {
      setUserAvatarUrl(userAvatarUrl);
    }
  }, []);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const validateFile = (file: File): string | undefined => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 50MB';
    }
    if (!VALID_FILE_TYPES.includes(file.type as any)) {
      return 'Invalid file type. Please upload PNG image or MP4/MOV video';
    }
    return undefined;
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileError = validateFile(file);
      if (fileError) {
        setErrors((prev) => ({ ...prev, file: fileError }));
        removeMedia();
      } else {
        setMedia(file);
        setErrors((prev) => ({ ...prev, file: undefined }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setPreview(null);
    setErrors((prev) => ({ ...prev, file: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (media) {
      const fileError = validateFile(media);
      if (fileError) {
        newErrors.file = fileError;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;
  
    setIsLoading(true);
    try {
      let mediaUrl;
      if (media) {
        mediaUrl = await uploadFileToSupabase(media);
      }
  
      // Xác định level khi tạo comment
      let level = undefined;
      if (parentCommentId) {
        const parentComment = await getCommentById(parentCommentId); // Lấy comment cha
        level = parentComment.level >= 3 ? 3 : parentComment.level + 1;
        console.log("levell trong form",level); // Không vượt quá level 3
      }
      
      
      const createCommentPayload: CreateCommentPayload = {
        feedId,
        content,
        mediaUrl,
        isChallenge,
        parentCommentId,
        level,
      };
      
      console.log("create createCommentPayload",createCommentPayload);
      await postComment(createCommentPayload, handleCommentSuccess);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSuccess = () => {
    setLoadComment((pre) => !pre);
    setCommentCount((pre) => pre + 1);
    setContent('');
    setMedia(null);
    setPreview(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Image
          alt={avatarUrl + ' avatar'}
          className="rounded-full object-cover sm:h-14 sm:w-14"
          src={avatarUrl ? avatarUrl.trim() : '/images/default-profile.png'}
          width={100}
          height={100}
        />
        <form className="item-center flex w-full" onSubmit={onSubmit}>
          <Textarea
            placeholder={username ? `Type your comment for ${username}` : 'Type your comment...'}
            className={`w-full ${errors.content ? 'border-red-500' : ''}`}
            value={content}
            onChange={handleContentChange}
            onKeyDown={(e) => {
              // Khi nhấn Ctrl+Enter để submit form
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                if (!isLoading && (content || media)) {
                  const form = e.currentTarget.closest('form');
                  if (form) form.requestSubmit();
                }
              }
            }}
            disabled={isLoading} // Vô hiệu hóa textarea khi loading
          />

          <div className="ml-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept={VALID_FILE_TYPES.join(',')}
                className="hidden"
                ref={fileInputRef}
                onChange={handleMediaChange}
                disabled={isLoading} // Vô hiệu hóa input file khi loading
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading} 
              >
                <ImageIcon className="h-7 w-7" />
              </Button>
            </div>
            <Button
              type="submit"
              variant={'join'}
              disabled={(!content.trim() && !media)|| !content || isLoading} // Vô hiệu hóa nút gửi khi loading
              className="m-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
      {preview && (
        <div className="relative mt-2 inline-block">
          {media?.type.startsWith('image/') ? (
            <img
              src={preview || '/placeholder.svg'}
              alt="Preview"
              className="max-h-40 max-w-xs object-contain"
            />
          ) : (
            <video src={preview} className="max-h-40 max-w-xs" controls />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-0 top-0 rounded-full"
            onClick={removeMedia}
            disabled={isLoading} // Vô hiệu hóa nút xóa khi loading
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {errors.content && (
        <p className="mt-1 text-sm text-red-500">{errors.content}</p>
      )}
      {errors.file && (
        <p className="mt-1 text-sm text-red-500">{errors.file}</p>
      )}
    </div>
  );
}
