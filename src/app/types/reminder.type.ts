import { Dispatch, SetStateAction } from "react";

export interface CreateCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Event) => void;
  selectedDate?: Date;
  event?: Event; 
  isUpdate?: boolean; 
}

export interface Event {
  id: string;
  title?: string;
  hashtag?: string;
  startDate: string;  
  endDate: string;   
  reminderContent: string;
  reminderTime?: string; 
  startTime: string; 
  endTime: string;   
  userId?: string;
  color?: string;
}

export interface EventListProps {
  event: Event;
  setIsRefreshingCalendarList: Dispatch<SetStateAction<boolean>>;
  
}


export interface CreateReminderRequest {
  title: string;
  hashtag?: string;
  startDate: string; 
  endDate: string;  
  reminderContent: string;
  reminderTime?: string; 
  startTime: string; 
  endTime: string;   
}

export interface UpdateReminderRequest {
  title?: string;
  hashtag?: string;
  startDate?: string;
  endDate?: string;
  reminderContent?: string;
  reminderTime?: string;
  startTime?: string;
  endTime?: string;
}

export interface ReminderSummaryProjection {
  id: string;
  title: string;
  hashtag?: string;
  startDate: string;
  endDate: string;
  reminderContent: string;
  reminderTime?: string;
  startTime: string;
  endTime: string;
  userId: string;
}