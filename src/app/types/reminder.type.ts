export interface CreateCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Event) => void;
  selectedDate?: Date;
  event?: Event; // Optional cho Update
  isUpdate?: boolean; // Optional để phân biệt Create/Update
}

export interface Event {
  id: string;
  title?: string;
  hashtag?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reminderContent: string;
  reminderTime?: string; // HH:mm
  startTime: string; // HH:mm, optional vì chỉ dùng khi không có hashtag
  endTime: string;   // HH:mm, optional vì chỉ dùng khi không có hashtag
  userId?: string;
  color?: string;
}

export interface EventListProps {
  event: Event;
}

// @/app/types/index.ts

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