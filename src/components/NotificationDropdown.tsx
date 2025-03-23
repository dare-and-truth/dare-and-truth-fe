'use client';

import type React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Heart,
  MessageSquare,
  UserCheck,
  UserPlus,
  UserRoundX,
} from 'lucide-react';
import type { NotificationItem } from '@/app/types';
import {
  getUserNotifications,
  markNotificationAsRead,
} from '@/app/api/notification.api';
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/api/friends.api';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/app/helpers/formatTimeAgo';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/contexts';
import { useUserApp } from '@/app/contexts/UserAppContext';
import Image from 'next/image';

export function NotificationDropdown({
  icon,
  text,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const { unreadNotificationsCount, setUnreadNotificationsCount } =
    useUserApp();
  // Remove this line: console.log(unreadNotificationsCount);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Ref for scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (page: number) => {
    try {
      setIsNotificationLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      await getUserNotifications(
        userId,
        {
          page,
          size: 15,
          sort: 'createdAt,desc',
        },
        (data) => {
          // Append new notifications or replace based on page
          const newNotifications =
            page === 0 ? data.content : [...notifications, ...data.content];

          setNotifications(newNotifications as NotificationItem[]);
          setHasMore(data.number < data.totalPages - 1);
        },
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      // Reset to first page when dropdown opens
      setCurrentPage(0);
      fetchNotifications(0);
    }
  }, [isDropdownOpen]);

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;

    const handleScroll = () => {
      if (!scrollArea) return;

      // Check if scrolled to bottom
      const isBottom =
        scrollArea.scrollHeight - scrollArea.scrollTop <=
        scrollArea.clientHeight + 20; // 20px buffer

      if (isBottom && hasMore && !isNotificationLoading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchNotifications(nextPage);
      }
    };

    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => {
        scrollArea.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasMore, isNotificationLoading, currentPage]);

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'friend-request':
        return UserPlus;
      case 'comment-post':
        return MessageSquare;
      case 'comment-challenge':
        return MessageSquare;
      case 'reply-comment-post':
        return MessageSquare;
      case 'reply-comment-challenge':
        return MessageSquare;
      case 'author-comment-challenge':
        return MessageSquare;
      case 'like-post':
        return Heart;
      case 'like-challenge':
        return Heart;
      default:
        return Bell;
    }
  }
  function getNotificationIconBg(type: string) {
    switch (type) {
      case 'friend-request':
        return 'border-blue-500 bg-blue-500';
      case 'comment-post':
        return 'border-green-500 bg-green-500';
      case 'comment-challenge':
        return 'border-green-500 bg-green-500';
      case 'reply-comment-post':
        return 'border-green-500 bg-green-500';
      case 'reply-comment-post':
        return 'border-green-500 bg-green-500';
      case 'author-comment-challenge':
        return 'border-yellow-500 bg-yellow-500';
      case 'like-post':
        return 'border-red-500 bg-red-500';
      case 'like-challenge':
        return 'border-red-500 bg-red-500';
      default:
        return '';
    }
  }

  const handleAccept = async (requestId: string) => {
    acceptFriendRequest(
      requestId,
      () => {
        toast.success('Friend request accepted!');
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) =>
              !(
                notification.type === 'friend-request' &&
                notification.relatedEntity.id === requestId
              ),
          ),
        );
      },
      (error) => {
        console.log(error);
      },
    );
  };

  const handleReject = async (requestId: string) => {
    await rejectFriendRequest(
      requestId,
      () => {
        toast.info('Friend request rejected.');
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) =>
              !(
                notification.type === 'friend-request' &&
                notification.relatedEntity.id === requestId
              ),
          ),
        );
      },
      (error) => {
        console.log(error);
      },
    );
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    try {
      setIsLoading(true);
      if (!notification.isRead) {
        setUnreadNotificationsCount((pre) => pre - 1);
        await markNotificationAsRead(notification.id);
      }
      setIsDropdownOpen(false);
      if (
        notification.type === 'like-post' ||
        notification.type === 'comment-post' ||
        notification.type === 'reply-comment-post'
      ) {
        router.push(`/feed/post/${notification.relatedEntity.id}`);
      } else if (
        notification.type === 'like-challenge' ||
        notification.type === 'comment-challenge' ||
        notification.type === 'reply-comment-challenge' ||
        notification.type === 'author-comment-challenge'
      ) {
        router.push(`/feed/challenge/${notification.relatedEntity.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotification = (notification: NotificationItem) => {
    let content = '';

    if (notification.type === 'like-post') {
      content = `Liked your post`;
    } else if (notification.type === 'like-challenge') {
      content = `Liked your challenge`;
    } else if (notification.type === 'comment-post') {
      content = `Commented on your challenge`;
    } else if (notification.type === 'comment-challenge') {
      content = `Commented on your challenge`;
    } else if (notification.type === 'reply-comment-post') {
      content = `Replied to your comment on a challenge`;
    } else if (notification.type === 'reply-comment-challenge') {
      content = `Replied to your comment on a challenge`;
    } else if (notification.type === 'author-comment-challenge') {
      content = `The author comment on a challenge`;
    } else if (notification.type === 'friend-request') {
      content = `Sent you a friend request`;
    }

    const NotificationIcon = getNotificationIcon(notification.type);
    return (
      <div
        key={notification.id}
        className={`relative mb-1 flex items-center gap-4 rounded-md p-3 shadow transition-colors hover:cursor-pointer hover:bg-slate-300 ${!notification.isRead ? 'bg-slate-200' : ''}`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="relative">
          <div className="flex-shrink-0">
            <Image
              height={0}
              width={0}
              src={
                notification.sender.senderAvatarUrl ||
                '/images/default-profile.png'
              }
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>

          {/* Unread indicator on avatar */}
          {!notification.isRead && (
            <span className="bg-primary absolute right-0 top-0 h-3 w-3 rounded-full"></span>
          )}

          {/* Notification type icon */}
          <div
            className={`absolute -bottom-2 -right-3 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-green-500 bg-green-500 shadow-sm ${getNotificationIconBg(notification.type)}`}
          >
            <NotificationIcon className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <p className={`${!notification.isRead ? 'font-medium' : ''}`}>
            <span className="font-semibold">
              {notification.sender.username.length > 24
                ? `${notification.sender.username.slice(0, 24)}...`
                : notification.sender.username}
            </span>{' '}
            <span
              className={`line-clamp-2 overflow-hidden text-ellipsis whitespace-pre-line ${
                !notification.isRead ? 'text-blue-600' : ''
              }`}
            >
              {content}
            </span>
          </p>
          <div className="flex items-center gap-2">
            {notification.type === 'friend-request' && (
              <div className="flex justify-start gap-2">
                <Button
                  variant="join"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    handleAccept(notification.relatedEntity.id);
                  }}
                  className="px-2"
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    handleReject(notification.relatedEntity.id);
                  }}
                  className="px-2"
                >
                  <UserRoundX className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
            {(notification.type === 'comment-challenge' ||
              notification.type === 'comment-post' ||
              notification.type === 'reply-comment-challenge' ||
              notification.type === 'reply-comment-post') && (
              <div className="bg-muted/50 rounded-md p-2 text-sm italic">
                {notification.content.length > 30
                  ? `${notification.content.substring(0, 30)}...`
                  : notification?.content}
              </div>
            )}
          </div>
          {notification.relatedEntity?.hashtag && (
            <div className="inline-flex items-center rounded-full bg-blue-300 px-2 py-0.5 text-xs font-medium text-blue-800">
              #
              {notification.relatedEntity.hashtag.length > 30
                ? `${notification.relatedEntity.hashtag.substring(0, 30)}...`
                : notification?.relatedEntity.hashtag}
            </div>
          )}
          <p className="text-muted-foreground text-end text-xs">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>

        {!notification.isRead && (
          <span className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-500"></span>
        )}
      </div>
    );
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          tooltip={text}
          className={`h-full ${active ? 'bg-gray-200 text-base' : 'text-base'}`}
        >
          <span className="relative mr-2">
            {icon}
            {unreadNotificationsCount > 0 && (
              <div className="absolute -right-0.5 -top-1.5 flex h-4 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </div>
            )}
          </span>
          <span>{text}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="sm:w-60 md:h-screen md:w-96 md:rounded-none"
        side="right"
        align="start"
        sideOffset={10}
      >
        <DropdownMenuLabel className="text-xl">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isNotificationLoading && notifications.length === 0 ? (
          <DropdownMenuItem>
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          </DropdownMenuItem>
        ) : error ? (
          <DropdownMenuItem className="text-red-500">{error}</DropdownMenuItem>
        ) : notifications.length > 0 ? (
          <div
            ref={scrollAreaRef}
            className="scrollbar h-[calc(100%-3rem)] overflow-y-auto"
          >
            <div>
              {notifications.map((notification) =>
                renderNotification(notification),
              )}
            </div>

            {/* Load More Indicator */}
            {isNotificationLoading && (
              <div className="flex items-center justify-center p-4">
                <Loading />
              </div>
            )}
          </div>
        ) : (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
