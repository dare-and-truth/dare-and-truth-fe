import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyChatProps {
  setCreateChatRoom: (open: boolean) => void;
}

export function EmptyChat({ setCreateChatRoom }: EmptyChatProps) {
  return (
    <div className="absolute bottom-0 left-[130px] top-0 flex w-[calc(100%-130px)] flex-col items-center justify-center border-l border-stone-300 bg-white p-6 dark:border-stone-700 dark:bg-[#1c1c1c] md:left-[350px] md:w-[calc(100%-350px)]">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-current">
        <MessageSquare className="h-12 w-12" />
      </div>
      <h2 className="mt-3 text-center text-xl dark:text-slate-100">
        Your messages
      </h2>
      <p className="mt-2 text-center text-xs text-gray-500">
        Send private photos and messages to a friend or group.
      </p>
      <Button
        className="mt-6 bg-[#0095f6] hover:bg-[#1aa3ff]"
        onClick={() => setCreateChatRoom(true)}
      >
        Send message
      </Button>
    </div>
  );
}
