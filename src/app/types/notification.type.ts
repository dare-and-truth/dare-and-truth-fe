export interface NotificationItem {
  id: string;
  type:
    | 'calendar-event'
    | 'friend-request'
    | 'like-post'
    | 'comment-post'
    | 'comment-challenge'
    | 'like-post'
    | 'like-challenge';
  content: string;
  sender: {
    username: string;
    avatarUrl: string;
  };
  isRead: boolean;
  relatedEntity: any;
  createdAt: string;
}
