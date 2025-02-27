'use client';

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { EventListProps } from '@/app/types/reminder.type';
import { DialogConfirm } from '@/components/DiaLogConfirmDelete';
import { Button } from '@/components/ui/button';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteReminder } from '@/app/api/reminder.api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { CreateCalendarDialog } from '@/components/CreateCalendarDialog';

export function CalendarList({ event }: EventListProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const hasHashtag = !!event.hashtag;

  const handleDeleteCalendar = async (calendarId: string) => {
    try {
      await deleteReminder(
        calendarId,
        () => {
          toast.success('Reminder deleted successfully');
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          toast.error('Error deleting reminder. Please try again');
        }
      );
    } catch (error) {
      toast.error('Error deleting reminder. Please try again');
    }
  };

  const displayTitle = event.title || event.hashtag || 'Untitled';

  return (
    <>
      <Card
        key={event.id}
        className={`border-none p-4 ${event.color} cursor-pointer`}
        onClick={() => setIsUpdateDialogOpen(true)}
      >
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-lg font-medium font-bold">{displayTitle}</p>
            <p className="text-muted-foreground text-sm">
              {format(new Date(event.startDate), 'MMM dd')} -{' '}
              {format(new Date(event.endDate), 'MMM dd')} |{' '}
              {event.startTime ? `${event.startTime} - ${event.endTime}` : `Reminder: ${event.reminderTime}`}
            </p>
          </div>
          <DialogConfirm
            button={
              <Button
                variant="icon"
                size="default"
                onClick={(e) => e.stopPropagation()}
                disabled={hasHashtag}
                className={hasHashtag ? 'text-gray-500 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}
              >
                <AiOutlineDelete />
              </Button>
            }
            title="Are you sure you want to delete this reminder?"
            onConfirm={() => handleDeleteCalendar(event.id)}
          />
        </div>
      </Card>

      <CreateCalendarDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onCreateEvent={() => {}}
        selectedDate={undefined}
        event={event}
        isUpdate={true}
      />
    </>
  );
}