// components/FriendRequestCard.tsx
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  unFriend,
  createFriendRequest,
} from '@/app/api/friends.api';
import { toast } from 'react-toastify';
import { FriendRequestCardProps } from '@/app/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function FriendRequestCard({
  avatar,
  username,
  followedAt,
  isAccepted: initialAccepted,
  acceptedAt,
  requestId,
  followerId,
  userId,
  width = 'w-[55%]',
  onAccept,
  onReject,
  onUnfriend,
  onAddFriend,
  mode = 'requests', // Prop mới để kiểm soát chế độ: 'requests', 'friends', hoặc 'search'
}: FriendRequestCardProps) {
  const [isAccepted, setIsAccepted] = useState(initialAccepted || false);
  const [loading, setLoading] = useState(false);
  const [maxUsernameLength, setMaxUsernameLength] = useState(30);
  const router = useRouter();

  // Lấy userId từ localStorage
  const currentUserId = localStorage.getItem('userId');

  // Kiểm tra nếu mode là 'requests' và người dùng hiện tại là người gửi, không hiển thị
  if (mode === 'requests' && currentUserId && followerId === currentUserId) {
    return null;
  }

  useEffect(() => {
    const updateUI = () => {
      if (window.innerWidth < 1024) {
        setMaxUsernameLength(25);
      } else if (window.innerWidth < 1280) {
        setMaxUsernameLength(20);
      } else {
        setMaxUsernameLength(30);
      }
    };

    updateUI();
    window.addEventListener('resize', updateUI);
    return () => window.removeEventListener('resize', updateUI);
  }, []);

  const isCurrentUserReceiver = userId === currentUserId;
  const isCurrentUserSender = followerId === currentUserId;

  const truncatedUsername =
    username?.length > maxUsernameLength
      ? `${username.slice(0, maxUsernameLength)}...`
      : username || 'Unknown User';

  const timeAgo = useMemo(() => {
    const fromDate = new Date(
      isAccepted && acceptedAt ? acceptedAt : followedAt || new Date(),
    );
    const now = new Date();
    const diffMs = now.getTime() - fromDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }, [followedAt, acceptedAt, isAccepted]);

  const handleAddFriend = async () => {
    if (!userId || !currentUserId) {
      toast.error('Invalid user ID.');
      return;
    }
    setLoading(true);
    try {
      await createFriendRequest({ userId, followerId: currentUserId }, () => {
        setIsAccepted(false);
        onAddFriend?.(userId, currentUserId);
        toast.success('Friend request sent!');
      });
    } catch (error) {
      toast.error('Failed to send friend request.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!requestId || !currentUserId) {
      toast.error('Invalid request or user ID.');
      return;
    }
    setLoading(true);
    try {
      const response = await acceptFriendRequest(
        requestId,
        (response) => {
          setIsAccepted(true);
          onAccept?.(requestId);
          toast.success('Friend request accepted!');
        },
        (error) => {
          toast.error('Failed to accept friend request.');
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!requestId || !currentUserId) {
      toast.error('Invalid request or user ID.');
      return;
    }
    setLoading(true);
    try {
      await rejectFriendRequest(
        requestId,
        (response) => {
          onReject?.(requestId);
          toast.info('Friend request rejected.');
        },
        (error) => {
          toast.error('Failed to reject friend request.');
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!requestId || !currentUserId || !followerId || !userId) {
      toast.error('Invalid request or user IDs.');
      return;
    }
    setLoading(true);
    try {
      const friendId = currentUserId === userId ? followerId : userId; // ID của người bạn cần xóa
      if (!friendId) {
        throw new Error('Friend ID is undefined.');
      }

      const response = await unFriend(
        friendId,
        (response) => {
          onUnfriend?.(requestId);
          setIsAccepted(false);
          toast.info('You have unfriended this user.');
        },
        (error) => {
          toast.error('Failed to unfriend.');
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const profileId = followerId !== currentUserId ? followerId : userId;

  return (
    <div
      className={`mb-4 flex items-center rounded-lg bg-white p-4 shadow-sm ${width} transition-all duration-300`}
    >
      <div className="flex-shrink-0">
        <Link href={`/profile/${profileId}`}>
          <Image
            src={avatar || '/images/default-profile.png'}
            alt="User Avatar"
            className="h-12 w-12 rounded-full object-cover"
            height={0}
            width={0}
          />
        </Link>
      </div>

      <div className="ml-4 flex-grow">
        <p className="text-lg font-semibold">{truncatedUsername}</p>
        {mode === 'requests' ? (
          <p className="text-sm text-gray-500">
            {isAccepted
              ? `Became friends ${timeAgo}`
              : `Sent friend request ${timeAgo}`}
          </p>
        ) : mode === 'friends' ? (
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : 'Friend'}
          </p>
        ) : (
          // Mode 'search'
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : 'Not friends'}
          </p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="join"
          className="w-24 rounded-lg px-4 py-2 font-semibold text-white"
          onClick={() =>
            router.push(`/message?userId=${userId}`, { scroll: false })
          }
        >
          Chat
        </Button>
        {mode === 'requests' ? (
          requestId ? (
            isAccepted ? (
              <Button
                variant="secondary"
                onClick={handleUnfriend}
                disabled={loading}
              >
                {loading ? 'Unfriending...' : 'Unfriend'}
              </Button>
            ) : isCurrentUserReceiver ? (
              <>
                <Button
                  variant="join"
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? 'Accepting...' : 'Accept'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            ) : null // Không hiển thị gì nếu không phải người nhận
          ) : (
            <Button variant="join" onClick={handleAddFriend} disabled={loading}>
              {loading ? 'Adding...' : 'Add Friend'}
            </Button>
          )
        ) : mode === 'friends' ? (
          requestId &&
          isAccepted && (
            <Button
              variant="secondary"
              onClick={handleUnfriend}
              disabled={loading}
            >
              {loading ? 'Unfriending...' : 'Unfriend'}
            </Button>
          )
        ) : // Mode 'search'
        userId && currentUserId ? (
          requestId ? (
            isAccepted ? (
              <Button
                variant="secondary"
                onClick={handleUnfriend}
                disabled={loading}
              >
                {loading ? 'Unfriending...' : 'Unfriend'}
              </Button>
            ) : isCurrentUserSender ? (
              <span className="font-semibold text-gray-500">Request Sent</span>
            ) : isCurrentUserReceiver ? (
              <>
                <Button
                  variant="default"
                  className="w-24 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? 'Accepting...' : 'Accept'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            ) : null
          ) : (
            <Button
              variant="default"
              className="w-24 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
              onClick={handleAddFriend}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Friend'}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
