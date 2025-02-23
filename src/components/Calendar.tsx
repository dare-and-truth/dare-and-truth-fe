'use client';

import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Event } from '@/app/types/calendar.type';
import { CreateCalendarDialog } from '@/components/CreateCalendarDialog';
import { CalendarList } from '@/components/CaledndarList';
import { isBefore, startOfDay } from 'date-fns';

export default function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    setIsDialogOpen(false);
  };

  const filteredEvents = events
    .filter((event) => event.startDate === date?.toISOString())
    .sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));

  return (
    <>
      <Card className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
        <Calendar
          mode="single"
          selected={date}
          disabled={(day) => isBefore(startOfDay(day), startOfDay(new Date()))}
          onSelect={handleDateSelect}
          className="flex items-center rounded-md border"
          classNames={{
            day: cn(
              buttonVariants({ variant: 'ghost' }),
              'h-14 w-20 transition-colors',
              'hover:bg-blue-400 hover:text-white',
              'aria-selected:bg-blue-500 aria-selected:text-white',
            ),
            head_cell: ' w-20',
            caption_label: 'text-lg font-bold',
            months: 'lg:ml-4',
            day_disabled: 'text-gray-400 opacity-50 cursor-not-allowed',
            day_selected: 'bg-blue-500 text-white',
          }}
        />
        <CreateCalendarDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCreateEvent={handleCreateEvent}
          selectedDate={date}
        />
      </Card>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Schedule for {date ? format(date, 'MMM dd') : 'Today'}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <CalendarList event={event} key={event.id} />
          ))}
        </div>
      </div>
    </>
  );
}
