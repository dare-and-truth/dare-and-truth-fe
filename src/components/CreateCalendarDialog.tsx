'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import type { CreateCalendarDialogProps, Event } from '@/app/types/reminder.type';
import { timeOptions } from '@/app/constants/index';
import { createReminder, updateReminder } from '@/app/api/reminder.api';

// Hàm tính reminderTime = startTime - 10 phút (di chuyển lên trước useEffect)
const calculateReminderTime = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes - 10;
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Quay vòng nếu trước 00:00
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
}: CreateCalendarDialogProps) {
  const [eventTitle, setEventTitle] = useState(event ? event.title : '');
  const [startTime, setStartTime] = useState<string>(event ? event.startTime : '10:00'); // Đảm bảo luôn là string
  const [endTime, setEndTime] = useState<string>(event ? event.endTime : '11:30'); // Đảm bảo luôn là string
  const [reminderContent, setReminderContent] = useState(event?.hashtag ? event.reminderContent : '');
  const [reminderTime, setReminderTime] = useState(
    event ? event.reminderTime : calculateReminderTime('10:00')
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    event ? new Date(event.startDate) : selectedDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    event ? new Date(event.endDate) : selectedDate
  );
  const [error, setError] = useState<string | null>(null);

  // Tính reminderTime khi startTime thay đổi (cho Create/Update không hashtag)
  useEffect(() => {
    if (startTime) { // Đảm bảo startTime không undefined
      const newReminderTime = calculateReminderTime(startTime);
      setReminderTime(newReminderTime);
    }
  }, [startTime, isUpdate, event?.hashtag]);

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && startDate && date >= startDate) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !eventTitle) {
      setError('Event title and start date are required.');
      return;
    }

    if (endDate && endDate < startDate) {
      setError('End date must be later than start date.');
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
      startTime: hasHashtag ? "" : startTime,
      endTime: hasHashtag ? "" : endTime,
      userId: event ? event.userId : 'temp-user-id',
      color: hasHashtag ? 'bg-blue-400' : 'bg-orange-300',
    };

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
            ...(hasHashtag ? {} : { startTime: `${startTime}:00`, endTime: `${endTime}:00` }), // Chỉ gửi startTime/endTime nếu không có hashtag
          },
          () => {
            toast.success('Reminder updated successfully!');
            onCreateEvent(updatedEvent);
            onClose();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
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
            setEventTitle('');
            setStartTime('10:00');
            setEndTime('11:30');
            setStartDate(selectedDate);
            setEndDate(selectedDate);
            setError(null);
            onClose();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
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
  };

  const handleClose = () => {
    setError(null);
    setEventTitle('');
    setStartTime('10:00');
    setEndTime('11:30');
    setStartDate(selectedDate);
    setEndDate(selectedDate);
    setReminderContent('');
    setReminderTime('');
    onClose();
  };

  const hasHashtag = isUpdate && event?.hashtag;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Reminder' : 'Create Reminder'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {hasHashtag ? (
              <Input
                placeholder="Hashtag"
                value={event.hashtag}
                disabled
              />
            ) : (
              <Input
                placeholder="Event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            )}
          </div>
          {hasHashtag && (
            <div className="space-y-2">
              <Textarea
                placeholder="Reminder content"
                value={reminderContent}
                onChange={(e) => setReminderContent(e.target.value)}
                rows={4}
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
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'MM/dd/yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'MM/dd/yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {hasHashtag ? (
              <div className="space-y-2">
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
              variant="default"
              onClick={handleSubmit}
              disabled={!eventTitle || !startDate}
            >
              {isUpdate ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}