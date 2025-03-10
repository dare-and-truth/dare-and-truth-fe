import { FriendProps } from '@/app/types';
import { Button } from '@/components/ui/button';
const FriendActionButton: React.FC<FriendProps> = ({
  type,
  handleAddFriend,
  handleAccept,
  handleReject,
  handleUnfriend,
}) => {
  switch (type) {
    case 'Friend':
      return (
        <Button variant="secondary" onClick={handleUnfriend}>
          Unfriend
        </Button>
      );
    case 'NeedAccept':
      return (
        <>
          <Button variant="join" onClick={handleAccept}>
            Accept
          </Button>
          <Button variant="secondary" onClick={handleReject}>
            Reject
          </Button>
        </>
      );
    case 'WaitingForAccept':
      return (
        <span className="rounded-md border border-zinc-200 bg-blue-600 px-2 py-2 text-sm text-white shadow-sm hover:bg-blue-800 hover:text-white dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
          Request Sent
        </span>
      );
    case 'Stranger':
      return (
        <Button variant="join" onClick={handleAddFriend}>
          Add Friend
        </Button>
      );
    default:
      return null;
  }
};

export default FriendActionButton;
