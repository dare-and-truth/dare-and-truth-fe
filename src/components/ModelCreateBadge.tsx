'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { AiOutlinePlus } from 'react-icons/ai';
import { createBadge } from '@/app/api/badge.api';
import { ChangeEvent, useRef, useState } from 'react';
import { convertBlobUrlToFile } from '@/lib/utils';
import { uploadImage } from '@/supabase/storage/client';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { ModalCreateBadge } from '@/app/types';

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters.' }),
    image: z.string(),
    badgeCriteria: z.number().min(0),
    points: z.number().min(0),
    startDay: z.date(),
    endDay: z.date(),
    description: z.string(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.startDay < data.endDay, {
    message: 'Start day should be less than end day.',
    path: ['startDay'],
  });

export function CreateBadge({ setRefreshBadge }: ModalCreateBadge) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      image: '',
      badgeCriteria: 1,
      points: 0,
      description: '',
    },
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file));
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const fetchCreateBadge = async () => {
      try {
        let uploadedUrl = imageUrl || '';

        if (imageUrl) {
          const imageFile = await convertBlobUrlToFile(imageUrl);
          const uploadResult = await uploadImage({
            file: imageFile,
            bucket: 'uploads',
          });

          if (uploadResult.error) {
            toast.error('Failed to upload image!');
            return;
          }

          uploadedUrl = uploadResult.imageUrl;
        }

        const newValues = { ...values, image: uploadedUrl };
        await createBadge(newValues);
        setRefreshBadge((prev) => !prev);
        setOpen(false);
        form.reset();
        setImageUrl(null);
      } catch (error) {
        console.error('Error creating badge:', error);
      }
    };

    fetchCreateBadge();
  }
  const handleOnclickCancel = () => {
    setOpen(false);
    form.reset();
    setImageUrl(null);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="default">
          <AiOutlinePlus /> New Badge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] lg:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Badge</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-3">
              <Separator />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-1/4">Title</FormLabel>
                    <div className="w-3/4">
                      <FormControl>
                        <Input placeholder="Reliable Companion" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-1/4">Image</FormLabel>
                    <FormControl className="w-3/4">
                      <div className="flex flex-row gap-2">
                        <Input
                          type="file"
                          ref={imageInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt="Selected image"
                            width={0}
                            height={0}
                            className="h-[50px] w-[100px] rounded-lg border object-cover"
                          />
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="badgeCriteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          inputMode="numeric"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/^0+/, '');
                            field.onChange(value ? Number(value) : '');
                          }}
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value > 0 ? value : 1);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          {...field}
                          onFocus={(e) => {
                            if (e.target.value === '0') {
                              field.onChange(0);
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            field.onChange(value ? Number(value) : 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, 'MM/dd/yyyy')
                                : 'Select date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <FormMessage className="text-red-300" />
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value || new Date()}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finish Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, 'MM/dd/yyyy')
                                : 'Select date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <FormMessage className="text-red-300" />
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <FormMessage className="text-red-300" />
              <CardFooter className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="px-4"
                  onClick={handleOnclickCancel}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 px-4 hover:bg-blue-700"
                >
                  CREATE
                </Button>
              </CardFooter>
            </CardContent>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
