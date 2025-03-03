'use client';

import { useState, type KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Smile } from 'lucide-react';
import { EmojiPicker } from './emoji-picker';

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
}

export function MessageInput({
  inputText,
  setInputText,
  onSend,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(inputText + emoji);
  };

  return (
    <div className="relative mx-1 mb-5 mt-3 flex justify-between rounded-full border border-stone-200 dark:border-stone-700 dark:bg-[#131313] md:mx-5">
      <button
        className="px-2 md:px-5"
        type="button"
        // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        aria-label="Open emoji selector"
      >
        <Smile className="h-4 w-4 text-gray-500 md:h-6 md:w-6" />
      </button>

      <TextareaAutosize
        className="my-3 w-[80%] resize-none text-sm focus:outline-none dark:bg-[#131313]"
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
            : 'text-[#0095F6]'
        } pr-2 text-xs font-semibold md:pl-2 md:pr-4 md:text-sm`}
        type="button"
        onClick={onSend}
        disabled={inputText.trim() === ''}
      >
        Send
      </button>

      {showEmojiPicker && (
        <div className="absolute left-0 top-[-340px]">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
}
