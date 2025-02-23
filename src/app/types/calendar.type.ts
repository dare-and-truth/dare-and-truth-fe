export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
  startDate: string;
  endDate: string;
}

export interface EventListProps {
  event: Event;
}

export interface CreateCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Event) => void;
  selectedDate: Date | undefined;
}
