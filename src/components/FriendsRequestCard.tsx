import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { acceptFriendRequest, rejectFriendRequest, unFriend } from '@/app/api/friends.api';
import { toast } from 'react-toastify';
import { FriendRequestCardProps } from '@/app/types/friends.type';

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
  mode = 'requests' // Prop mới để kiểm soát chế độ: 'requests' hoặc 'friends'
}: FriendRequestCardProps & { mode?: 'requests' | 'friends' }) {
  const [isAccepted, setIsAccepted] = useState(initialAccepted || false);
  const [loading, setLoading] = useState(false);
  const [maxUsernameLength, setMaxUsernameLength] = useState(30);
  const [cardWidth, setCardWidth] = useState("w-[65%]");

  // Lấy userId từ localStorage
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');

  // Kiểm tra nếu mode là 'requests' và người dùng hiện tại là người gửi, trả về null để không hiển thị
  if (mode === 'requests' && (!currentUserId || followerId === currentUserId)) {
    return null; // Không hiển thị card nếu là người gửi trong chế độ yêu cầu
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

  // Debug log để kiểm tra vai trò
  console.log('Card props:', { mode, requestId, followerId, userId, currentUserId, isCurrentUserReceiver, isAccepted, username });

  const truncatedUsername = username?.length > maxUsernameLength 
  ? `${username.slice(0, maxUsernameLength)}...` 
  : username || "Unknown User";

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
  
  const handleAccept = async () => {
    if (!requestId || !currentUserId) {
      toast.error("Invalid request or user ID.");
      return;
    }
    setLoading(true);
    console.log("request id check",requestId);
    try {
      const response = await acceptFriendRequest(
        requestId , 
        (response) => {
          console.log("ré pon",response);
          setIsAccepted(true);
          onAccept && onAccept(requestId);
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
        requestId,
        (response) => {
          onReject && onReject(requestId);
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
      
      console.log("unfriend id",targetId);
      if (!targetId) {
        throw new Error("Target ID is undefined.");
      }
  
      const response = await unFriend(
        targetId,
        (response) => {
          onUnfriend && onUnfriend(requestId);
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
        ) : (
          <p className="text-sm text-gray-500">
            {isAccepted ? `Became friends ${timeAgo}` : 'Friend'}
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
                disabled={loading}>
                  {loading ? "Unfriending...":"Unfriend"}
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
          ) : (
            <Button 
              variant="default" 
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg" 
              onClick={() => {}} // Thay bằng handleAddFriend nếu cần
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Friend"}
            </Button>
          )
        ) : (
          requestId && isAccepted && (
            <Button 
              variant="outline" 
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={handleUnfriend}
              disabled={loading}>
                {loading ? "Unfriending..." : "Unfriend"}
            </Button>
          )
        )}
      </div>
    </div>
  );
}