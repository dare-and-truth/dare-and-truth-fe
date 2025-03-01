export interface NotificationItem {
  id: string;
  type: 'calendar_event' | 'accept_friend' | 'like' | 'comment';
  user?: {
    username: string;
    avatar: string;
  };
  content?: string;
  time: string;
  image?: string;
}
