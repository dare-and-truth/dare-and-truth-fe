import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

export function formatTimeAgo(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds === 1) {
    return '1 second ago';
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) {
    return '1 minute ago';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // For messages sent today
  if (isToday(date)) {
    const secondsAgo = differenceInSeconds(now, date);
    const minutesAgo = differenceInMinutes(now, date);

    // Just now (less than a minute ago)
    if (secondsAgo < 60) {
      return 'Just now';
    }

    // Within the last hour: "X min ago"
    if (minutesAgo < 60) {
      return `${minutesAgo} min ago`;
    }

    // Otherwise show the time
    return format(date, 'h:mm a'); // e.g., "10:30 AM"
  }

  // For messages sent yesterday
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  // For messages sent within the last week (less than 7 days ago)
  const daysAgo = differenceInDays(now, date);
  if (daysAgo < 7) {
    return `${format(date, 'EEEE')} at ${format(date, 'h:mm a')}`; // e.g., "Monday at 10:30 AM"
  }

  // For messages from this year but more than a week ago
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d at h:mm a'); // e.g., "Jan 15 at 10:30 AM"
  }

  // For older messages (different year)
  return format(date, 'MMM d, yyyy at h:mm a'); // e.g., "Jan 15, 2023 at 10:30 AM"
};
