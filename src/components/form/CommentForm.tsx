'use client';

import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, SendHorizontal, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MAX_FILE_SIZE, VALID_FILE_TYPES } from '@/app/constants';
import { uploadFileToSupabase } from '@/app/helpers/uploadFileToSupabase';
import { postComment } from '@/app/api/comment.api';
import type { CreateCommentPayload } from '@/app/types';

type FormErrors = {
  content?: string;
  file?: string;
};

export default function CommentForm({
  feedId,
  setLoadComment,
}: {
  feedId: string;
  setLoadComment: Dispatch<SetStateAction<boolean>>;
}) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
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
    if (validateForm()) {
      try {
        let mediaUrl;
        if (media) {
          mediaUrl = await uploadFileToSupabase(media);
        }

        const createCommentPayload: CreateCommentPayload = {
          feedId,
          content,
          mediaUrl,
          isChallenge: true,
        };
        await postComment(createCommentPayload, handleCommentSuccess);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleCommentSuccess = () => {
    setLoadComment((pre) => (pre = !pre));
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
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <form className="item-center flex w-full" onSubmit={onSubmit}>
          <Textarea
            placeholder="Type your comment..."
            className={`w-full ${errors.content ? 'border-red-500' : ''}`}
            value={content}
            onChange={handleContentChange}
          />
          <div className="ml-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept={VALID_FILE_TYPES.join(',')}
                className="hidden"
                ref={fileInputRef}
                onChange={handleMediaChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-7 w-7" />
              </Button>
            </div>
            <Button
              type="submit"
              variant={'join'}
              disabled={!content && !media}
              className="m-1"
            >
              <SendHorizontal className="h-4 w-4" />
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
