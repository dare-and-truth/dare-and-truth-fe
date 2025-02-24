'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { JoinDialogProps } from '@/app/types';
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
import { timeOptions } from '@/app/constants/index';

const FormSchema = z
  .object({
    content: z
      .string()
      .min(10, { message: 'Reminder content must be at least 10 characters.' })
      .max(160, {
        message: 'Reminder content must not exceed 160 characters.',
      }),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Start time earlier than End time',
    path: ['endTime'],
  });

export function JoinChallengeDialog({ challenge, button }: JoinDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      startTime: '10:00',
      endTime: '11:30',
      content:
        'It’s time to conquer today’s challenge! 💪   > Put on your running shoes and hit the road. Just 3km a day brings you closer to the reward and better health! 🚀',
    },
  });
  const { reset } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Integrating api join on here =))
    console.log('Form submitted:', data);
    setOpen(false);
  }

  const handleCancel = () => {
    setOpen(false);
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
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-semibold text-blue-600">
                        Reminder Start
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent className="h-48">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-semibold text-blue-600">
                        Reminder End
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent className="h-48">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-blue-600">
                      Reminder Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Can you modify your content?"
                        className="resize-none border-gray-300"
                        rows={6}
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
