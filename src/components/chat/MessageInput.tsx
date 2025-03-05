'use client';

import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Smile } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { MessageInputProps } from '@/app/types';

export function MessageInput({
  inputText,
  setInputText,
  onSend,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(inputText + emoji);
    // Focus the input after selecting an emoji
    inputRef.current?.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        !document.querySelector('.emoji-picker')?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="sticky bottom-0 bg-white px-4 py-3 dark:bg-[#1c1c1c]">
      <div className="relative flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 dark:border-stone-700 dark:bg-[#262626]">
        <button
          ref={emojiButtonRef}
          className="flex-shrink-0 p-1"
          type="button"
          onClick={toggleEmojiPicker}
          aria-label="Open emoji selector"
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </button>

        <TextareaAutosize
          ref={inputRef}
          className="mx-2 flex-1 resize-none bg-transparent py-2 text-sm focus:outline-none dark:bg-[#262626] dark:text-white"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message..."
          maxRows={4}
          minRows={1}
          onKeyPress={handleKeyPress}
        />
        <button
          className={`${
            inputText.trim() === ''
              ? 'pointer-events-none text-[#9dd8ff]'
              : 'text-blue-500'
          } pr-2`}
          type="button"
          onClick={onSend}
          disabled={inputText.trim() === ''}
        >
          <Image className="h-5 w-5" />
        </button>

        <button
          className={`${
            inputText.trim() === ''
              ? 'pointer-events-none text-[#9dd8ff]'
              : 'text-blue-500'
          } `}
          type="button"
          onClick={onSend}
          disabled={inputText.trim() === ''}
        >
          Send
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
