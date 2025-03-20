export interface NotificationItem {
  id: string;
  type:
    | 'calendar-event'
    | 'friend-request'
    | 'like-post'
    | 'comment-post'
    | 'comment-challenge'
    | 'reply-comment-post'
    | 'reply-comment-challenge'
    | 'like-post'
    | 'like-challenge';
  content: string;
  sender: {
    username: string;
    senderAvatarUrl: string;
  };
  isRead: boolean;
  relatedEntity: any;
  createdAt: string;
}
