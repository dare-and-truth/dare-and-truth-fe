'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type {
  CreateCalendarDialogProps,
  Event,
} from '@/app/types/calendar.type';

const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export function CreateCalendarDialog({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
}: CreateCalendarDialogProps) {
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedDate);
  const [error, setError] = useState<string | null>(null);
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && startDate && date >= startDate) {
      setError(null);
    }
  };

  const handleCreateCalendar = () => {
    if (!startDate || !eventTitle) return;

    if (endDate && endDate < startDate) {
      setError('End date must be later than start date.');
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString() || startDate.toISOString(),
      startTime,
      endTime,
      color: `bg-${['red', 'blue'][Math.floor(Math.random() * 2)]}-500/10 dark:bg-${['red', 'blue'][Math.floor(Math.random() * 2)]}-900/20`,
    };
    onCreateEvent(newEvent);
    setEventTitle('');
    onClose();
  };
  const handleClose = () => {
    setError(null);
    setEventTitle('');
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Calendar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
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
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, 'MM/dd/yyyy')
                        : 'Select date'}
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
                <label className="mb-1 block text-sm font-medium">
                  End Date
                </label>
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
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>

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
          </div>
          <div className="space-y-2">
            <Select defaultValue="no-repeat">
              <SelectTrigger>
                <SelectValue placeholder="Repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-repeat">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="default"
              onClick={handleCreateCalendar}
              disabled={!eventTitle || !startDate}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
