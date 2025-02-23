'use client';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { EventListProps } from '@/app/types/calendar.type';
import { DialogConfirm } from '@/components/DiaLogConfirmDelete';
import { Button } from '@/components/ui/button';
import { AiOutlineDelete } from 'react-icons/ai';

export function CalendarList({ event }: EventListProps) {
  const handleDeleteCalendar = async (calendarId: string) => {
    try {
      // await deleteCalendar(badgeId);
    } catch (error) {
      console.error('Error deleting badge:', error);
    }
  };

  return (
    <Card key={event.id} className={`border-none p-4 ${event.color}`}>
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6" />
        <div className="flex-1">
          <p className="text-lg font-medium">{event.title}</p>
          <p className="text-muted-foreground text-sm">
            {format(new Date(event.startDate), 'MMM dd')} -{' '}
            {format(new Date(event.startDate), 'MMM dd')} {event.startTime} -{' '}
            {event.endTime}
          </p>
        </div>
        <DialogConfirm
          button={
            <Button variant="icon" size="default">
              <AiOutlineDelete className="text-red-500 hover:text-red-700" />
            </Button>
          }
          title="Are you want to delete?"
          onConfirm={() => handleDeleteCalendar(event.id)}
        />
      </div>
    </Card>
  );
}
