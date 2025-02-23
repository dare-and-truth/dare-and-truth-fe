import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { acceptFriendRequest,rejectFriendRequest, unFriend } from '@/app/api/friends.api'; // Import API
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
  onUnfriend   
}: FriendRequestCardProps) {
  const [isAccepted, setIsAccepted] = useState(initialAccepted);
  const [loading, setLoading] = useState(false);
  const [maxUsernameLength, setMaxUsernameLength] = useState(30);
  const [cardWidth, setCardWidth] = useState("w-[65%]");

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

  const truncatedUsername = username?.length > maxUsernameLength 
  ? `${username.slice(0, maxUsernameLength)}...` 
  : username || "Unknown User";

  const timeAgo = useMemo(() => {
    const fromDate = new Date(isAccepted ? acceptedAt! : followedAt);
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
    setLoading(true);
    try {
      const response = await acceptFriendRequest(
        { requestId }, 
        (response) => {
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
    setLoading(true);
    try {
      await rejectFriendRequest(
        { requestId },
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
    setLoading(true);
    try {
      const user_id = localStorage.getItem("userId"); 
      const targetId = user_id === followerId ? userId : followerId; 
  
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
        <img src={avatar} alt="User Avatar" className="w-12 h-12 rounded-full" />
      </div>

      <div className="ml-4 flex-grow">
        <p className="font-semibold text-lg">{truncatedUsername}</p>
        <p className="text-sm text-gray-500">
          {isAccepted ? `Became friends ${timeAgo}` : `Sent friend request ${timeAgo}`}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isAccepted ? (
          <Button 
          variant="outline" 
          className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
          onClick={handleUnfriend}
          disabled={loading}>
            {loading ? "Unfriending...":"Unfriend"}
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
}
