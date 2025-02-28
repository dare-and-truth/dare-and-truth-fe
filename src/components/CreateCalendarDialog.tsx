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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';
import type { CreateCalendarDialogProps, Event } from '@/app/types/reminder.type';
import { timeOptions } from '@/app/constants/index';
import { createReminder, updateReminder } from '@/app/api/reminder.api';
import { format, isBefore, startOfDay } from 'date-fns';
import { useLoading } from '@/app/contexts';

const calculateReminderTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes - 10;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

export function CreateCalendarDialog({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
  event,
  isUpdate = false,
  setIsRefreshingCalendarList
}: CreateCalendarDialogProps) {
  const [eventTitle, setEventTitle] = useState(event ? event.title || '' : '');
  const [startTime, setStartTime] = useState<string>(event?.startTime || '10:00');
  const [endTime, setEndTime] = useState<string>(event?.endTime || '11:30');
  const [reminderContent, setReminderContent] = useState(event?.hashtag ? (event.reminderContent || '') : '');
  const {setIsLoading} = useLoading();
  const [reminderTime, setReminderTime] = useState(
    event?.reminderTime || calculateReminderTime('10:00')
  );

  const [startDate, setStartDate] = useState<Date | undefined>(
    event ? new Date(event.startDate) : selectedDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    event ? new Date(event.endDate) : selectedDate
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startTime && (!isUpdate || !event?.hashtag)) {
      const newReminderTime = calculateReminderTime(startTime);
      setReminderTime(newReminderTime);
    }
  }, [startTime, isUpdate, event?.hashtag]);

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setError('End date must be greater than or equal to start date.');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!startDate || (!eventTitle && !event?.hashtag)) {
      setError('Title and start date are required.');
      return;
    }

    if (endDate && endDate < startDate) {
      setError('End date must be greater than or equal to start date.');
      return;
    }

    const today = startOfDay(new Date());
    if (!isUpdate &&startDate && isBefore(startDate, today)) {
      setError('Start date cannot be in the past.');
      return;
    }
    if (!isUpdate && endDate && isBefore(endDate, today)) {
      setError('End date cannot be in the past.');
      return;
    }

    if (!event?.hashtag && endTime && startTime && endTime <= startTime) {
      setError('End time must be greater than start time.');
      return;
    }

    const hasHashtag = isUpdate && event?.hashtag;
    const reminderContentValue = hasHashtag ? reminderContent : `Time for ${eventTitle} at ${startTime}`;
    const reminderTimeValue = hasHashtag ? reminderTime : calculateReminderTime(startTime);

    const updatedEvent: Event = {
      id: event ? event.id : Date.now().toString(),
      title: hasHashtag ? event.hashtag : eventTitle,
      hashtag: hasHashtag ? event.hashtag : undefined,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : format(startDate, 'yyyy-MM-dd'),
      reminderContent: reminderContentValue,
      reminderTime: reminderTimeValue,
      startTime: hasHashtag ? '' : startTime,
      endTime: hasHashtag ? '' : endTime,
      userId: event ? event.userId : 'temp-user-id',
      color: hasHashtag ? 'bg-blue-400' : 'bg-orange-300',
    };

    setIsLoading(true)
    try {
      if (isUpdate && event) {
        await updateReminder(
          event.id,
          {
            title: hasHashtag ? event.hashtag : eventTitle,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : format(startDate, 'yyyy-MM-dd'),
            reminderContent: reminderContentValue,
            reminderTime: `${reminderTimeValue}:00`,
            ...(hasHashtag ? {} : { startTime: `${startTime}:00`, endTime: `${endTime}:00` }),
          },
          () => {
            toast.success('Reminder updated successfully!');
            onCreateEvent(updatedEvent);
            onClose();
            setIsRefreshingCalendarList(pre => !pre)
          },
          (error) => {
            toast.error('Failed to update reminder. Please try again.');
            setError('Failed to update reminder. Please try again.');
          }
        );
      } else {
        await createReminder(
          {
            title: eventTitle,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : format(startDate, 'yyyy-MM-dd'),
            reminderContent: reminderContentValue,
            reminderTime: `${reminderTimeValue}:00`,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
          },
          () => {
            toast.success('Reminder created successfully!');
            onCreateEvent(updatedEvent);
            onClose();
            setIsRefreshingCalendarList(pre => !pre)
          },
          (error) => {
            toast.error('Failed to create reminder. Please try again.');
            setError('Failed to create reminder. Please try again.');
          }
        );
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setError('Something went wrong. Please try again.');
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const hasHashtag = isUpdate && event?.hashtag;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{isUpdate ? 'Update Reminder' : 'Create Reminder'}</DialogTitle>
          <DialogDescription className="text-center">
            {isUpdate ? 'Edit the details of your reminder below.' : 'Create a new reminder by filling in the details below.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium">
            {hasHashtag ? 'Hashtag' : 'Title'}
          </label>
            {hasHashtag ? (
              <Input placeholder="Hashtag" value={`#${event.hashtag}`} disabled maxLength={255} />
            ) : (
              <Input
                placeholder="Event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                maxLength={255}
              />
            )}
          </div>
          {hasHashtag && (
            <div className="space-y-2">
              <label className="mb-1 block text-sm font-medium">Reminder content</label>
              <Textarea
                placeholder="Reminder content"
                value={reminderContent}
                onChange={(e) => setReminderContent(e.target.value)}
                rows={4}
                maxLength={255}
              />
            </div>
          )}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!!event?.hashtag}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'MM/dd/yyyy') : 'Select date'}
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
                <label className="mb-1 block text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={!!event?.hashtag}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'MM/dd/yyyy') : 'Select date'}
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
              <div className="space-y-2">
                <label className="mb-1 block text-sm font-medium">Reminder Time</label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Reminder time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Start Time</label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">End Time</label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button
              variant="join"
              onClick={handleSubmit}
              disabled={hasHashtag ? !event?.hashtag || !startDate : !eventTitle || !startDate}
            >
              {isUpdate ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}