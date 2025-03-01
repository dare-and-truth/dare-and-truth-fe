'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { NotificationItem } from '@/app/types';

export function NotificationDropdown({
  icon,
  text,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  const [showNotifications, setShowNotifications] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'calendar_event',
      content: 'Team meeting at 2:00 PM',
      time: 'Today',
    },

    {
      id: '3',
      type: 'accept_friend',
      user: {
        username: 'venn.flynn',
        avatar: '/images/default-profile.png',
      },
      time: 'Today',
    },
    {
      id: '4',
      type: 'like',
      user: {
        username: 'beyondzey',
        avatar: '/images/default-profile.png',
      },
      content: 'your post',
      time: 'This week',
      image: '/images/default-profile.png',
    },
    {
      id: '5',
      type: 'comment',
      user: {
        username: 'beyondzey',
        avatar: '/images/default-profile.png',
      },
      content:
        'your post: "Great post!" your post: "Great post!"your post: "Great post!"your post: "Great post!"your post: "Great post!"',
      time: 'Earlier',
      image: '/images/default-profile.png',
    },
  ];

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);

  // Categorize notifications by time
  const todayNotifications = displayedNotifications.filter(
    (notification) => notification.time === 'Today',
  );
  const thisMonthNotifications = displayedNotifications.filter(
    (notification) => notification.time === 'This week',
  );
  const previousNotifications = displayedNotifications.filter(
    (notification) => notification.time === 'Earlier',
  );

  const handleToggleShowAll = (e: Event) => {
    e.preventDefault();
    setShowAll((prev) => !prev);
  };

  const renderNotification = (notification: NotificationItem) => (
    <div
      key={notification.id}
      className="hover:bg-accent flex items-center gap-4 rounded-md p-2"
    >
      {/* Avatar only if user exists */}
      {notification.user ? (
        <Avatar className="h-12 w-12">
          <AvatarImage src={notification.user.avatar} />
          <AvatarFallback>{notification.user.username[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <Calendar className="ml-1 h-10 w-10" />
      )}
      <div className="flex-1">
        {notification.type === 'calendar_event' ? (
          <div>
            <p className="text-sm font-bold">Calendar Reminder</p>
            <p className="text-muted-foreground text-blue-600">
              {notification.content}
            </p>
          </div>
        ) : notification.type === 'accept_friend' ? (
          <div>
            <p className="font-semibold">{notification.user!.username}</p>{' '}
            <p className="text-blue-600">Friend request. </p>
          </div>
        ) : (
          <p>
            <span className="font-semibold">{notification.user!.username}</span>{' '}
            <span className="line-clamp-1 overflow-hidden text-ellipsis whitespace-pre-line text-blue-600">
              {notification.type === 'like' ? 'Liked ' : 'Commented on '}{' '}
              {notification.content}.
            </span>
          </p>
        )}
      </div>
      {notification.type === 'accept_friend' && (
        <Button variant="join" size="sm">
          Accept
        </Button>
      )}
      {(notification.type === 'like' || notification.type === 'comment') &&
        notification.image && (
          <div className="h-10 w-10 flex-shrink-0">
            <Image
              src={notification.image}
              alt="Content"
              className="h-full w-full rounded-md object-cover"
              width={0}
              height={0}
            />
          </div>
        )}
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          tooltip={text}
          className={active ? 'bg-gray-200 text-base' : 'text-base'}
        >
          <span className="mr-2">{icon}</span>
          <span>{text}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="sm:w-60 md:h-screen md:w-80 md:rounded-none"
        side="right"
        align="start"
        sideOffset={10}
      >
        <DropdownMenuLabel className="text-xl">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showNotifications && displayedNotifications.length > 0 ? (
          <ScrollArea className="h-[calc(100%-6rem)]">
            {/* Today */}
            {todayNotifications.length > 0 && (
              <div className="p-4">
                <h3 className="mb-2 font-semibold">Today</h3>
                {todayNotifications.map(renderNotification)}
              </div>
            )}
            {todayNotifications.length > 0 &&
              (thisMonthNotifications.length > 0 ||
                previousNotifications.length > 0) && <Separator />}

            {/* This month */}
            {thisMonthNotifications.length > 0 && (
              <div className="p-4">
                <h3 className="mb-2 font-semibold">This week</h3>
                {thisMonthNotifications.map(renderNotification)}
              </div>
            )}
            {thisMonthNotifications.length > 0 &&
              previousNotifications.length > 0 && <Separator />}

            {/* Earlier */}
            {previousNotifications.length > 0 && (
              <div className="p-4">
                <h3 className="mb-2 font-semibold">Earlier</h3>
                {previousNotifications.map(renderNotification)}
              </div>
            )}
          </ScrollArea>
        ) : (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        )}
        {notifications.length > 3 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleToggleShowAll}
              className="cursor-pointer"
            >
              {showAll
                ? 'Collapse'
                : `View all notifications (${notifications.length})`}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
