'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { JoinDialogProps } from '@/app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { timeOptions } from '@/app/constants/index';
import { createReminder } from '@/app/api/reminder.api';
import { useLoading } from '@/app/contexts';
import { toast } from 'react-toastify';

const FormSchema = z.object({
  reminderContent: z
    .string()
    .min(10, { message: 'Reminder content must be at least 10 characters.' })
    .max(100, {
      message: 'Reminder content must not exceed 100 characters.',
    }),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Please enter a valid time in HH:MM format',
  }),
  hashtag: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export function JoinChallengeDialog({
  challenge,
  button,
  setIsJoined,
}: JoinDialogProps) {
  const { setIsLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      reminderTime: '10:00',
      reminderContent: `Time to crush your # ${challenge.hashtag} challenge! 🏃‍♂️💨 Head to DoDo and let is make it happen! 🚀`,
      hashtag: challenge.hashtag,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    },
  });
  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      createReminder(data, handleSubmitSuccess);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setIsDropdownOpen(false);
    reset();
  };

  const handleSubmitSuccess = () => {
    setIsJoined(true);
    setOpen(false);
    toast.success('Join challenge successfully!');
    setIsDropdownOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="rounded-lg p-6 sm:max-w-[450px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">
            Join #{challenge.hashtag}
          </DialogTitle>
        </DialogHeader>
        <hr className="border-gray-300" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-600">
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(challenge.startDate, 'MM/dd/yyyy')}
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-600">
              Finish Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(challenge.endDate, 'MM/dd/yyyy')}
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
        </div>

        <div className="space-y-6 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="reminderTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-semibold text-blue-600">
                        Reminder Time
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="HH:MM"
                            className="w-full pr-10"
                            onFocus={() => setIsDropdownOpen(true)}
                            onChange={(e) => {
                              let value = e.target.value.replace(
                                /[^0-9:]/g,
                                '',
                              );
                              if (value.length > 5) value = value.slice(0, 5);
                              field.onChange(value);
                              setIsDropdownOpen(false);
                            }}
                          />
                        </FormControl>
                        <ChevronDown
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        {isDropdownOpen && (
                          <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                            {timeOptions.map((time) => (
                              <button
                                key={time}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange(time);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reminderContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-blue-600">
                      Reminder Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Can you modify your content?"
                        className="resize-none border-gray-300"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="join">
                  Join
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
