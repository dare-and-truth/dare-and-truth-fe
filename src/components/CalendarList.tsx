'use client';

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Activity, Calendar, Mountain, Trophy } from 'lucide-react';
import { EventListProps } from '@/app/types/reminder.type';
import { DialogConfirm } from '@/components/DiaLogConfirmDelete';
import { Button } from '@/components/ui/button';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteReminder } from '@/app/api/reminder.api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { CreateCalendarDialog } from '@/components/CreateCalendarDialog';
import { useLoading } from '@/app/contexts';

export function CalendarList({ event, setIsRefreshingCalendarList }: EventListProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const hasHashtag = !!event.hashtag;
  const {setIsLoading, isLoading} = useLoading();

  const handleDeleteCalendar = async (calendarId: string) => {
    setIsLoading(true);
    try {
      await deleteReminder(
        calendarId,
        () => {
          toast.success('Reminder deleted successfully');
          setIsRefreshingCalendarList(pre => !pre)
        },
        (error) => {
          toast.error('Error deleting reminder. Please try again');
          setIsDeleting(false); 
        }
      );
    } catch (error) {
      toast.error('Error deleting reminder. Please try again');
    }finally{
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!isDeleteDialogOpen && !isDeleting) { 
      setIsUpdateDialogOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const displayTitle = event.title || event.hashtag || 'Untitled';

  return (
    <>
      <Card
        key={event.id}
        className={`border-none p-4 ${event.color} cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-3">
        {hasHashtag ? (
          <Trophy className="h-6 w-6" /> 
        ) : (
          <Calendar className="h-6 w-6" />
        )}
          <div className="flex-1">
            <p className="text-lg font-bold">{displayTitle}</p>
            <p className="text-muted-foreground text-sm">
            {event.startTime ? (
              <>
                <span className="font-bold">{event.startTime}</span> -{' '}
                <span className="font-bold">{event.endTime}{' | '}</span>
              </>
            ) : (
              <span className="font-bold">{event.reminderTime} {' | '}</span>
            )}
            {format(new Date(event.startDate), 'MMM dd')} -{' '}
            {format(new Date(event.endDate), 'MMM dd')} 
            </p>
          </div>
          {!isUpdateDialogOpen && (
            <DialogConfirm
              button={
                <Button
                  variant="icon"
                  size="default"
                  onClick={handleDeleteClick}
                  className={'text-red-500 hover:text-red-700'}
                >
                  {!hasHashtag && <AiOutlineDelete />}
                </Button>
              }
              title="Are you sure you want to delete this reminder?"
              onConfirm={() => handleDeleteCalendar(event.id)}
              onClose={handleDeleteDialogClose}
            />
          )}
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