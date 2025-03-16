'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ExpandedModal } from '@/components/ExpandedModal';

interface FilePreviewProps {
  fileType: 'image' | 'video' | 'other';
  previewUrl: string;
  onDelete?: () => void;
  className?: string;
}

export function FilePreview({
  fileType,
  previewUrl,
  onDelete,
  className = '',
}: FilePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const closeExpanded = () => {
    setIsExpanded(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="cursor-pointer" onClick={toggleExpanded}>
        {fileType === 'image' && (
          <img
            src={previewUrl || '/placeholder.svg'}
            alt="Preview"
            className="h-20 w-20 rounded object-cover"
          />
        )}

        {fileType === 'video' && (
          <video src={previewUrl} className="h-20 w-20 rounded object-cover">
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the preview expansion
            onDelete();
          }}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          aria-label="Remove file"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Render modal using the new component */}
      {isExpanded && (
        <ExpandedModal
          fileType={fileType}
          previewUrl={previewUrl}
          onClose={closeExpanded}
        />
      )}
    </div>
  );
}
