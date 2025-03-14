'use client';

import { formatMessageTime } from '@/app/helpers/formatTimeAgo';
import type { MessageBubbleProps } from '@/app/types';
import { ExpandedModal } from '@/components/ExpandedModal';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function MessageBubble({
  message,
  isCurrentUser,
  showTimestamp,
  className,
}: MessageBubbleProps) {
  const [isViewingImage, setIsViewingImage] = useState(false);

  return (
    <div
      className={`my-1 flex ${className} ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex max-w-[60%] flex-col md:max-w-[50%]">
        {message.mediaUrl && (
          <img
            src={message.mediaUrl || '/placeholder.svg'}
            alt="Sent image"
            className="mb-2 max-w-full rounded-lg hover:cursor-pointer"
            onClick={() => setIsViewingImage(true)}
          />
        )}
        {message.content && (
          <div
            className={`group flex flex-col whitespace-pre-wrap ${isCurrentUser ? 'items-end' : 'items-start'}`}
          >
            {showTimestamp ? (
              <div
                className={`w-fit max-w-[150%] break-words rounded-2xl px-4 py-2 text-sm ${
                  isCurrentUser
                    ? 'rounded-br-sm bg-blue-600 text-white dark:bg-zinc-800'
                    : 'rounded-bl-sm border border-gray-200 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100'
                } `}
              >
                {message.content?.trim()}
              </div>
            ) : (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-fit max-w-[150%] break-words rounded-2xl px-4 py-2 text-sm ${
                        isCurrentUser
                          ? 'rounded-br-sm bg-blue-600 text-white dark:bg-zinc-800'
                          : 'rounded-bl-sm border border-gray-200 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100'
                      } `}
                    >
                      {message.content?.trim()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center">
                    {formatMessageTime(message.sentAt)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        {showTimestamp && (
          <div
            className={`mt-1 text-end text-xs text-gray-500 dark:text-gray-400`}
          >
            {formatMessageTime(message.sentAt)}
          </div>
        )}
      </div>
      {isViewingImage && (
        <ExpandedModal
          fileType="image"
          previewUrl={message.mediaUrl!}
          onClose={() => setIsViewingImage(false)}
        />
      )}
    </div>
  );
}
