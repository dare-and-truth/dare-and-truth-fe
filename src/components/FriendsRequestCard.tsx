// components/FriendRequestCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { acceptFriendRequest, rejectFriendRequest, unFriend, createFriendRequest } from '@/app/api/friends.api';
import { toast } from 'react-toastify';
import { FriendRequestCardProps } from '@/app/types';

export default function FriendRequestCard({ 
  avatar, 
  username, 
  followedAt, 
  isAccepted: initialAccepted, 
  acceptedAt, 
  requestId, 
  followerId,
  userId,
  onAccept,        
  onReject,        
  onUnfriend,   
  onAddFriend,     
  mode = 'requests' // Prop mới để kiểm soát chế độ: 'requests', 'friends', hoặc 'search'
}: FriendRequestCardProps) {
  const [isAccepted, setIsAccepted] = useState(initialAccepted || false);
  const [loading, setLoading] = useState(false);
  const [maxUsernameLength, setMaxUsernameLength] = useState(30);
  const [cardWidth, setCardWidth] = useState("w-[65%]");

  // Lấy userId từ localStorage
  const currentUserId = localStorage.getItem('userId');

  // Kiểm tra nếu mode là 'requests' và người dùng hiện tại là người gửi (follower), không hiển thị
  if (mode === 'requests' && currentUserId && followerId === currentUserId) {
    return null; // Không hiển thị card nếu là người gửi trong chế độ yêu cầu
  }

  // Kiểm tra nếu mode là 'search' và userId là user hiện tại, không hiển thị
  if (mode === 'search' && currentUserId && userId === currentUserId) {
    return null; // Không hiển thị user hiện tại trong chế độ tìm kiếm
  }

  useEffect(() => {
    const updateUI = () => {
      if (window.innerWidth < 1024) {
        setMaxUsernameLength(25);
        setCardWidth("w-[100%]"); 
      } else if (window.innerWidth < 1280) {
        setMaxUsernameLength(20);
        setCardWidth("w-[65%]");
      } else {
        setMaxUsernameLength(30);
        setCardWidth("w-[65%]");
      }
    };

    updateUI();
    window.addEventListener("resize", updateUI);
    return () => window.removeEventListener("resize", updateUI);
  }, []);

  const isCurrentUserReceiver = userId === currentUserId;
  const isCurrentUserSender = followerId === currentUserId;

  // Debug log để kiểm tra vai trò
  console.log('Card props:', { mode, requestId, followerId, userId, currentUserId, isCurrentUserReceiver, isCurrentUserSender, isAccepted });

  // Lấy username phù hợp: follower.username nếu userId là user hiện tại, ngược lại dùng user.username
  const displayedUsername = currentUserId && userId === currentUserId 
    ? (followerId ? localStorage.getItem('username') || username : username) // Hiển thị follower.username
    : username || "Unknown User";

  const truncatedUsername = displayedUsername.length > maxUsernameLength 
    ? `${displayedUsername.slice(0, maxUsernameLength)}...` 
    : displayedUsername;

  const timeAgo = useMemo(() => {
    const fromDate = new Date(
      isAccepted && acceptedAt ? acceptedAt : followedAt || new Date()
    );
    const now = new Date();
    const diffMs = now.getTime() - fromDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }, [followedAt, acceptedAt, isAccepted]);
  
  const handleAddFriend = async () => {
    if (!userId || !currentUserId) {
      toast.error("Invalid user ID.");
      return;
    }
    setLoading(true);
    try {
      await createFriendRequest(
        { userId, followerId: currentUserId },
        () => {
          setIsAccepted(false); // Cập nhật trạng thái sau khi gửi yêu cầu
          onAddFriend?.(userId, currentUserId);
          toast.success("Friend request sent!");
        }
      );
    } catch (error) {
      toast.error("Failed to send friend request.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!requestId || !currentUserId) {
      toast.error("Invalid request or user ID.");
      return;
    }
    setLoading(true);
    try {
      await acceptFriendRequest(
        { requestId }, 
        (response) => {
          setIsAccepted(true);
          onAccept?.(requestId);
          toast.success("Friend request accepted!");
        },
        (error) => {
          toast.error("Failed to accept friend request.");
        }
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleReject = async () => {
    if (!requestId || !currentUserId) {
      toast.error("Invalid request or user ID.");
      return;
    }
    setLoading(true);
    try {
      await rejectFriendRequest(
        { requestId },
        (response) => {
          onReject?.(requestId);
          toast.info("Friend request rejected.");
        },
        (error) => {
          toast.error("Failed to reject friend request.");
        }
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnfriend = async () => {
    if (!requestId || !currentUserId || !followerId || !userId) {
      toast.error("Invalid request or user IDs.");
      return;
    }
    setLoading(true);
    try {
      const targetId = currentUserId === followerId ? userId : followerId;
  
      if (!targetId) {
        throw new Error("Target ID is undefined.");
      }
  
      await unFriend(
        targetId,
        (response) => {
          onUnfriend?.(requestId);
          setIsAccepted(false); // Cập nhật trạng thái sau khi unfriend
          toast.info("You have unfriended this user.");
        },
        (error) => {
          toast.error("Failed to unfriend.");
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center p-4 bg-white rounded-lg shadow-sm mb-4 ${cardWidth} transition-all duration-300`}>
      <div className="flex-shrink-0">
        <img src={avatar || '/images/default-profile.png'} alt="User Avatar" className="w-12 h-12 rounded-full" />
      </div>

      <div className="ml-4 flex-grow">
        <p className="font-semibold text-lg">{truncatedUsername}</p>
        {mode === 'requests' ? (
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : `Sent friend request ${timeAgo}`}
          </p>
        ) : mode === 'friends' ? (
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : 'Friend'}
          </p>
        ) : ( // Mode 'search'
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : 'Not friends'}
          </p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {mode === 'requests' ? (
          requestId ? (
            isAccepted ? (
              <Button 
                variant="outline" 
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                onClick={handleUnfriend}
                disabled={loading}
              >
                {loading ? "Unfriending..." : "Unfriend"}
              </Button>
            ) : isCurrentUserReceiver ? (
              <>
                <Button 
                  variant="default" 
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg" 
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? "Accepting..." : "Accept"}
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? "Rejecting..." : "Reject"}
                </Button>
              </>
            ) : null // Không hiển thị gì nếu không phải người nhận
          ) : null // Không hiển thị nút trong mode 'requests' nếu không có requestId
        ) : mode === 'friends' ? (
          requestId && isAccepted && (
            <Button 
              variant="outline" 
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={handleUnfriend}
              disabled={loading}
            >
              {loading ? "Unfriending..." : "Unfriend"}
            </Button>
          )
        ) : ( // Mode 'search'
          userId && currentUserId ? (
            requestId ? (
              isAccepted ? (
                <Button 
                  variant="outline" 
                  className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                  onClick={handleUnfriend}
                  disabled={loading}
                >
                  {loading ? "Unfriending..." : "Unfriend"}
                </Button>
              ) : isCurrentUserSender ? (
                <span className="text-gray-500 font-semibold">Request Sent</span>
              ) : isCurrentUserReceiver ? (
                <>
                  <Button 
                    variant="default" 
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg" 
                    onClick={handleAccept}
                    disabled={loading}
                  >
                    {loading ? "Accepting..." : "Accept"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                    onClick={handleReject}
                    disabled={loading}
                  >
                    {loading ? "Rejecting..." : "Reject"}
                  </Button>
                </>
              ) : null
            ) : (
              <Button 
                variant="default" 
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg" 
                onClick={handleAddFriend}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Friend"}
              </Button>
            )
          ) : null
        )}
      </div>
    </div>
  );
}