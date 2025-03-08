'use client';

import { useRef } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

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
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤔',
    '🤫',
    '🤭',
    '🤗',
    '😱',
  ];

  return (
    <div
      ref={pickerRef}
      className="emoji-picker grid grid-cols-8 gap-1 rounded-lg border border-stone-300 bg-white p-2 shadow-lg dark:border-stone-700 dark:bg-[#262626] sm:grid-cols-10"
    >
      {emojis.map((emoji, index) => (
        <button
          key={index}
          className="h-8 w-8 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onEmojiSelect(emoji)}
          aria-label={`Emoji ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
