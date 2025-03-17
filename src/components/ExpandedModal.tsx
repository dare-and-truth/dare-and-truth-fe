'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ExpandedModalProps {
  fileType: 'image' | 'video' | 'other';
  previewUrl: string;
  onClose?: () => void;
}

export function ExpandedModal({
  fileType,
  previewUrl,
  onClose,
}: ExpandedModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Internal close handler that will call the provided onClose if available
  // or handle closing internally if not
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Handle ESC key press
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listeners
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // If we're handling visibility internally and it's not visible, don't render anything
  if (!onClose && !isVisible) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div ref={contentRef} className="relative max-h-[90vh] max-w-[90vw]">
        <button
          onClick={handleClose}
          className="absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {fileType === 'image' && (
          <img
            src={previewUrl || '/placeholder.svg'}
            alt="Preview"
            className="max-h-[85vh] max-w-[85vw] rounded object-contain"
          />
        )}

        {fileType === 'video' && (
          <video
            src={previewUrl}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[85vw] rounded"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>,
    document.body,
  );
}