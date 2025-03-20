'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';
import type {
  CreateCalendarDialogProps,
  Event,
} from '@/app/types/reminder.type';
import { timeOptions } from '@/app/constants/index';
import { createReminder, updateReminder } from '@/app/api/reminder.api';
import { format, isBefore, startOfDay } from 'date-fns';
import { useLoading } from '@/app/contexts';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const calculateReminderTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes - 10;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

const FormSchema = z.object({
  eventTitle: z
    .string()
    .min(1, 'Title is required when creating a new event')
    .optional(),
  reminderContent: z.string().optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
});

export function CreateCalendarDialog({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
  event,
  isUpdate = false,
  setIsRefreshingCalendarList,
}: CreateCalendarDialogProps) {
  const { setIsLoading } = useLoading();
  const [startDate, setStartDate] = useState<Date | undefined>(
    event ? new Date(event.startDate) : selectedDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    event ? new Date(event.endDate) : selectedDate,
  );
  const [error, setError] = useState<string | null>(null);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [isReminderTimeOpen, setIsReminderTimeOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      eventTitle: event ? event.title || '' : '',
      reminderContent: event?.hashtag ? event.reminderContent || '' : '',
      reminderTime: event?.reminderTime || calculateReminderTime('10:00'),
      startTime: event?.startTime || '10:00',
      endTime: event?.endTime || '11:30',
    },
  });
  const { reset } = form;
  useEffect(() => {
    if (form.watch('startTime') && (!isUpdate || !event?.hashtag)) {
      const newReminderTime = calculateReminderTime(form.watch('startTime'));
      form.setValue('reminderTime', newReminderTime);
    }
  }, [form.watch('startTime'), isUpdate, event?.hashtag, form]);

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setError('End date must be greater than or equal to start date.');
    } else {
      setError(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Validate startDate (không nằm trong schema vì là state riêng)
    if (!startDate) {
      setError('Start date is required.');
      return;
    }

    // Các validate khác giữ nguyên từ logic cũ
    if (endDate && endDate < startDate) {
      setError('End date must be greater than or equal to start date.');
      return;
    }

    const today = startOfDay(new Date());
    if (!isUpdate && startDate && isBefore(startDate, today)) {
      setError('Start date cannot be in the past.');
      return;
    }
    if (!isUpdate && endDate && isBefore(endDate, today)) {
      setError('End date cannot be in the past.');
      return;
    }

    if (
      !event?.hashtag &&
      data.endTime &&
      data.startTime &&
      data.endTime <= data.startTime
    ) {
      setError('End time must be greater than start time.');
      return;
    }

    const hasHashtag = isUpdate && event?.hashtag;
    const reminderContentValue = hasHashtag
      ? data.reminderContent || ''
      : `Time for ${data.eventTitle || 'Event'} at ${data.startTime || '10:00'}`;
    const reminderTimeValue = hasHashtag
      ? data.reminderTime || calculateReminderTime('10:00')
      : calculateReminderTime(data.startTime || '10:00');

    const updatedEvent: Event = {
      id: event ? event.id : Date.now().toString(),
      title: hasHashtag ? event.hashtag : data.eventTitle || '',
      hashtag: hasHashtag ? event.hashtag : undefined,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: endDate
        ? format(endDate, 'yyyy-MM-dd')
        : format(startDate, 'yyyy-MM-dd'),
      reminderContent: reminderContentValue,
      reminderTime: reminderTimeValue,
      startTime: hasHashtag ? '' : data.startTime || '10:00',
      endTime: hasHashtag ? '' : data.endTime || '11:30',
      userId: event ? event.userId : 'temp-user-id',
      color: hasHashtag ? 'bg-blue-400' : 'bg-orange-300',
    };

    setIsLoading(true);
    try {
      if (isUpdate && event) {
        await updateReminder(
          event.id,
          {
            title: hasHashtag ? event.hashtag : data.eventTitle || '',
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: endDate
              ? format(endDate, 'yyyy-MM-dd')
              : format(startDate, 'yyyy-MM-dd'),
            reminderContent: reminderContentValue,
            reminderTime: `${reminderTimeValue}:00`,
            ...(hasHashtag
              ? {}
              : {
                  startTime: `${data.startTime || '10:00'}:00`,
                  endTime: `${data.endTime || '11:30'}:00`,
                }),
          },
          () => {
            toast.success('Reminder updated successfully!');
            onCreateEvent(updatedEvent);
            onClose();
            setIsRefreshingCalendarList((pre) => !pre);
          },
          (error) => {
            toast.error('Failed to update reminder. Please try again.');
            setError('Failed to update reminder. Please try again.');
          },
        );
      } else {
        if (!data.eventTitle) {
          setError('Title is required when creating a new event.');
          return;
        }
        await createReminder(
          {
            title: data.eventTitle,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: endDate
              ? format(endDate, 'yyyy-MM-dd')
              : format(startDate, 'yyyy-MM-dd'),
            reminderContent: reminderContentValue,
            reminderTime: `${reminderTimeValue}:00`,
            startTime: `${data.startTime || '10:00'}:00`,
            endTime: `${data.endTime || '11:30'}:00`,
          },
          () => {
            toast.success('Reminder created successfully!');
            onCreateEvent(updatedEvent);
            reset();
            onClose();
            setIsRefreshingCalendarList((pre) => !pre);
          },
          (error) => {
            toast.error('Failed to create reminder. Please try again.');
            setError('Failed to create reminder. Please try again.');
          },
        );
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
    reset();
  };

  const hasHashtag = isUpdate && event?.hashtag;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isUpdate ? 'Update Reminder' : 'Create Reminder'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isUpdate
              ? 'Edit the details of your reminder below.'
              : 'Create a new reminder by filling in the details below.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="eventTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{hasHashtag ? 'Hashtag' : 'Title'}</FormLabel>
                  <FormControl>
                    {hasHashtag ? (
                      <Input
                        placeholder="Hashtag"
                        value={`#${event.hashtag}`}
                        disabled
                        maxLength={255}
                      />
                    ) : (
                      <Input
                        placeholder="Event title"
                        {...field}
                        maxLength={30}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasHashtag && (
              <FormField
                control={form.control}
                name="reminderContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Reminder content"
                        {...field}
                        rows={4}
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!!event?.hashtag}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate
                          ? format(startDate, 'MM/dd/yyyy')
                          : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    {!hasHashtag && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!!event?.hashtag}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate
                          ? format(endDate, 'MM/dd/yyyy')
                          : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    {!hasHashtag && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>
              </div>

              {hasHashtag ? (
                <FormField
                  control={form.control}
                  name="reminderTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Time</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="HH:MM"
                            className="w-full pr-10"
                            onFocus={() => setIsReminderTimeOpen(true)}
                            onChange={(e) => {
                              let value = e.target.value.replace(
                                /[^0-9:]/g,
                                '',
                              );
                              if (value.length > 5) value = value.slice(0, 5);
                              field.onChange(value);
                              setIsReminderTimeOpen(false);
                            }}
                          />
                        </FormControl>
                        <ChevronDown
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setIsReminderTimeOpen(!isReminderTimeOpen)
                          }
                        />
                        {isReminderTimeOpen && (
                          <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                            {timeOptions.map((time) => (
                              <button
                                key={time}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange(time);
                                  setIsReminderTimeOpen(false);
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
              ) : (
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Start Time</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="HH:MM"
                              className="w-full pr-10"
                              onFocus={() => setIsStartTimeOpen(true)}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9:]/g,
                                  '',
                                );
                                if (value.length > 5) value = value.slice(0, 5);
                                field.onChange(value);
                                setIsStartTimeOpen(false);
                              }}
                            />
                          </FormControl>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                          />
                          {isStartTimeOpen && (
                            <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                              {timeOptions.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                  onClick={() => {
                                    field.onChange(time);
                                    setIsStartTimeOpen(false);
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
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>End Time</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="HH:MM"
                              className="w-full pr-10"
                              onFocus={() => setIsEndTimeOpen(true)}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9:]/g,
                                  '',
                                );
                                if (value.length > 5) value = value.slice(0, 5);
                                field.onChange(value);
                                setIsEndTimeOpen(false);
                              }}
                            />
                          </FormControl>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                          />
                          {isEndTimeOpen && (
                            <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                              {timeOptions.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                  onClick={() => {
                                    field.onChange(time);
                                    setIsEndTimeOpen(false);
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
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button
                variant="join"
                type="submit"
                disabled={
                  hasHashtag ? !event?.hashtag || !startDate : !startDate
                }
              >
                {isUpdate ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
