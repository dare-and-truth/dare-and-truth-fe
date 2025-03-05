import { MessageSquare } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white p-6 dark:bg-[#1c1c1c] md:border-l md:border-stone-300 md:dark:border-stone-700">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-current">
        <MessageSquare className="h-12 w-12" />
      </div>
      <h2 className="mt-3 text-center text-xl dark:text-slate-100">
        Your messages
      </h2>
      <p className="mt-2 text-center text-xs text-gray-500">
        Send private photos and messages to a friend or group.
      </p>
    </div>
  );
}
