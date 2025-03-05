import { toast, type ToastContentProps } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { UserCheck, UserPlus, UserRoundX } from 'lucide-react';
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/api/friends.api';

interface FriendRequestToastProps extends ToastContentProps {
  name: string;
  avatarUrl: string;
  requestId: string;
  senderId: string;
}

export const FriendRequestToast = ({
  closeToast,
  name,
  avatarUrl,
  requestId,
  senderId,
}: FriendRequestToastProps) => {
  const handleAccept = async () => {
    acceptFriendRequest(
      requestId,
      () => {
        toast.success('Friend request accepted!');
      },
      (error) => {
        console.log(error);
        toast.error('Failed to accept friend request.');
      },
    );
  };

  const handleReject = async () => {
    await rejectFriendRequest(
      requestId,
      () => {
        toast.info('Friend request rejected.');
      },
      (error) => {
        console.log(error);
        toast.error('Failed to reject friend request.');
      },
    );
  };

  return (
    <div className="flex min-w-[300px] flex-col gap-3 p-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex-shrink-0">
            <img
              src={avatarUrl || '/images/default-profile.png'}
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="bg-primary absolute -bottom-1 -right-1 rounded-full border-2 border-blue-500 bg-blue-500 p-0.5">
            <UserPlus className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            Sent you a friend request
          </p>
        </div>
      </div>

      <div className="flex w-full justify-end gap-2">
        <Button
          variant="join"
          onClick={() => {
            handleAccept();
            closeToast();
          }}
          className="px-3 py-1"
        >
          <UserCheck />
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleReject();
            closeToast();
          }}
          className="px-3 py-1"
        >
          <UserRoundX />
          Reject
        </Button>
      </div>
    </div>
  );
};
