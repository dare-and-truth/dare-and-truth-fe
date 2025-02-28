'use client';

import { format,isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Event } from '@/app/types/reminder.type'; 
import { CreateCalendarDialog } from '@/components/CreateCalendarDialog';
import { CalendarList } from '@/components/CalendarList';
import { getAllRemindersByDate } from '@/app/api/reminder.api'; 
import { useLoading } from '@/app/contexts';

const getInitialDate = (): Date => {
  const savedDate = localStorage.getItem('selectedDate');
  return savedDate ? new Date(savedDate) : new Date();
};

export default function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(getInitialDate());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isRefreshingCalendarList, setIsRefreshingCalendarList] = useState(false);
  const {setIsLoading} = useLoading();

  useEffect(() => {
    if (date) {
      fetchEventsByDate(date);
      localStorage.setItem('selectedDate', date.toISOString());
    }
  }, [date, isRefreshingCalendarList]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]); 
    setIsDialogOpen(false);
  };

  const fetchEventsByDate = async (selectedDate: Date) => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const reminders = await getAllRemindersByDate(formattedDate);
      const fetchedEvents: Event[] = reminders.map((item: any) => ({
        id: item.id,
        title: item.title,
        hashtag: item.hashtag,
        startDate: item.startDate,
        endDate: item.endDate,
        reminderContent: item.reminderContent,
        reminderTime: item.reminderTime ? item.reminderTime.slice(0, 5) : undefined,
        startTime: item.startTime? item.startTime.slice(0, 5) : undefined, 
        endTime: item.endTime? item.endTime.slice(0, 5) :undefined,    
        userId: item.userId,
        color: item.hashtag ? 'bg-blue-400' : 'bg-orange-300', 
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setEvents([]);
    }
  };

  const filteredEvents = events.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));

  return (
    <>
      <Card className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="flex items-center rounded-md border"
          classNames={{
            day: cn(
              buttonVariants({ variant: 'ghost' }),
              'h-14 w-20 transition-colors',
              'hover:bg-blue-400 hover:text-white',
              'aria-selected:bg-blue-500 aria-selected:text-white',
              
            ),
            head_cell: 'w-20',
            caption_label: 'text-lg font-bold',
            months: 'lg:ml-4',
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
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-center">There are no events for this day</p>
          ) : (
            filteredEvents.map((event) => <CalendarList event={event} setIsRefreshingCalendarList = {setIsRefreshingCalendarList} key={event.id} />)
          )}
        </div>
      </div>
    </>
  );
}