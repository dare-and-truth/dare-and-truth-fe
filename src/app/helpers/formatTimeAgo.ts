import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import moment from 'moment-timezone';

export function formatTimeAgo(createdAt: string): string {
  // Convert UTC time to Vietnam timezone
  const date = moment.utc(createdAt).tz('Asia/Ho_Chi_Minh');
  const now = moment().tz('Asia/Ho_Chi_Minh');
  const diffInSeconds = now.diff(date, 'seconds');

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = now.diff(date, 'minutes');
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = now.diff(date, 'hours');
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = now.diff(date, 'days');
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.format('DD MMMM YYYY, HH:mm');
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
