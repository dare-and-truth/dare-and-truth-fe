'use client';

import { useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreatePostFormProps, CreatePostPayload } from '@/app/types';
import { X } from 'lucide-react';
import { MAX_FILE_SIZE, VALID_FILE_TYPES } from '@/app/constants';
import { uploadFileToSupabase } from '@/app/helpers/uploadFileToSupabase';
import { postPost } from '@/app/api/post.api';
import { useRouter } from 'next/navigation';

// Type definitions
type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Zod Schema
const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'File size must be less than 50MB',
    )
    .refine(
      (file) => VALID_FILE_TYPES.includes(file.type as any),
      'Invalid file type. Please upload PNG image or MP4/MOV video',
    ),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' })
    .max(225, { message: 'Content must not exceed 225 characters.' }),
});

export default function CreatePostForm({
  selectedItemHashtag,
  setSelectedItemHashtag,
}: CreatePostFormProps) {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [filePreview, setFilePreview] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validatedFile = formSchema.shape.file.parse(file);
      setFormData((prev) => ({ ...prev, file: validatedFile }));
      setErrors((prev) => ({ ...prev, file: undefined }));

      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, file: error.errors[0].message }));
      }
    }
  };

  // Cleanup file preview when file changes or component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrors({});

    try {
      const validatedData = formSchema.parse(formData);
      const { file, ...formdata } = validatedData;
      const mediaUrl = await uploadFileToSupabase(file);

      const createChallengePayload = {
        ...formdata,
        mediaUrl,
        hashtag: selectedItemHashtag,
      };
      await postPost(
        createChallengePayload as CreatePostPayload,
        handleCreateSuccess,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof FormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ file: 'Failed to upload file. Please try again.' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSuccess = () => {
    router.push('/home');
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: undefined })); // Giữ lại content nếu muốn
    setFilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Kiểm tra form có hợp lệ để enable nút Post
  const isFormValid =
    formData.file && formData.content && !errors.file && !errors.content;

  return (
    <div className="rounded-lg border p-6 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="font-bold">Hashtag</div>
          <Input
            name="hashtag"
            value={`# ${selectedItemHashtag}`}
            disabled
            className="font-bold text-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="font-bold">Describe</div>
          <Textarea
            name="content"
            placeholder="Share your journey with us..."
            value={formData.content || ''}
            rows={5}
            onChange={handleChange}
            disabled={isUploading}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={VALID_FILE_TYPES.join(',')}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
          {filePreview && formData.file && (
            <div className="relative w-full">
              {formData.file.type.startsWith('image/') ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="h-[250px] w-full rounded-md border object-cover"
                />
              ) : (
                <video
                  controls
                  className="h-[250px] w-full rounded-md border-red-600"
                >
                  <source src={filePreview} type={formData.file.type} />
                  Your browser does not support the video tag.
                </video>
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedItemHashtag(null)}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isUploading || !isFormValid}
            variant="join"
          >
            {isUploading ? 'Uploading...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
