'use client';

import { useContext, useRef, useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from '@/app/utils/Supabase';
import { CreateChallengePayload } from '@/app/types';
import { postChallenge } from '@/app/api/challenge.api';

const supabase = supabaseClient;

// Type definitions
type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Constants
const VALID_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'video/mp4',
  'video/mov',
] as const;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Zod Schema
const formSchema = z
  .object({
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
    hashtag: z
      .string()
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Hashtag can only contain letters, numbers and underscores',
      ),
    content: z.string(),
    startDate: z
      .string()
      .refine(
        (date) =>
          new Date(date).setHours(0, 0, 0, 0) >=
          new Date().setHours(0, 0, 0, 0),
        'Start date must be today or in the future',
      ),
    endDate: z
      .string()
      .refine(
        (date) => new Date(date) >= new Date(),
        'End date must be in the future',
      ),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export default function CreateChallengeDialog(props: any) {
  // State
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [filePreview, setFilePreview] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate single file
      const validatedFile = z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          'File size must be less than 50MB',
        )
        .refine(
          (file) => VALID_FILE_TYPES.includes(file.type as any),
          'Invalid file type',
        )
        .parse(file);

      setFormData((prev) => ({ ...prev, file: validatedFile }));
      setErrors((prev) => ({ ...prev, file: undefined }));

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, file: error.errors[0].message }));
      }
    }
  };

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = formSchema.parse(formData);

      // Upload file to Supabase
      const { file, ...formdata } = validatedData;
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const userId = localStorage.getItem('userId');

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // Here you would send the complete data to your backend
      const createChallengePayload = {
        ...formdata,
        userId,
        mediaUrl: urlData.publicUrl,
      };

      await postChallenge(
        createChallengePayload as CreateChallengePayload,
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
    setOpen(false);
    props.setRefreshChallenge((pre: boolean) => (pre = !pre));
    // Reset form
    setFormData({});
    setFilePreview('');
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Chalenge</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept={VALID_FILE_TYPES.join(',')}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file}</p>
            )}
            {filePreview &&
              (formData.file?.type.startsWith('image/') ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full object-contain"
                />
              ) : (
                <video controls className="w-full">
                  <source src={filePreview} type={formData.file?.type} />
                  Your browser does not support the video tag.
                </video>
              ))}
          </div>

          {/* Hashtag */}
          <div className="space-y-2">
            <div className="font-bold">Hashtag</div>
            <Input
              name="hashtag"
              placeholder="#Hashtag"
              value={formData.hashtag || ''}
              onChange={handleChange}
              disabled={isUploading}
            />
            {errors.hashtag && (
              <p className="text-sm text-red-500">{errors.hashtag}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="font-bold">Content</div>
            <Textarea
              name="content"
              placeholder="Write something..."
              value={formData.content || ''}
              onChange={handleChange}
              disabled={isUploading}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 font-bold">Start Date</div>
            <div className="space-y-2 font-bold">End Date</div>
            <div className="space-y-2">
              <Input
                name="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={handleChange}
                disabled={isUploading}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                name="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={handleChange}
                disabled={isUploading}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isUploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
