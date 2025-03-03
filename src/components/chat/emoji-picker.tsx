'use client';

import { useEffect, useRef } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.id?.includes('emoji')) {
          // Close emoji picker when clicking outside
          document.removeEventListener('mousedown', handleClickOutside);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Common emojis
  const emojis = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🤩',
    '👍',
    '👎',
    '❤️',
    '🔥',
    '✨',
    '🎉',
    '👏',
    '🙏',
    '💯',
    '💪',
  ];

  return (
    <div
      ref={pickerRef}
      className="grid grid-cols-10 gap-1 rounded-lg border border-stone-300 bg-white p-2 shadow-lg dark:border-stone-700 dark:bg-[#262626]"
    >
      {emojis.map((emoji, index) => (
        <button
          key={index}
          className="h-8 w-8 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onEmojiSelect(emoji)}
          id="emoji"
          aria-label={`Emoji ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
