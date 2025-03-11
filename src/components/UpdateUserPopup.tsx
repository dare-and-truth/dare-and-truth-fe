'use client';

import { useState, useRef } from 'react';
import { uploadFileToSupabase } from '@/app/helpers/uploadFileToSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type UpdateUserPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    user: { avatarUrl: string; username: string; email: string };
    onUpdate: (updatedUser: { avatarUrl: string; username: string; email: string }) => void;
  };

export function UpdateUserPopup({ isOpen, onClose, user, onUpdate }: UpdateUserPopupProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Xử lý chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFileToSupabase(file);
      console.log('Uploaded avatar URL:', uploadedUrl);
      setAvatarUrl(uploadedUrl || '');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setIsUploading(false);
  };

  // Xử lý submit
  const handleSubmit = async () => {
    localStorage.setItem('avatarUrl', avatarUrl);
    localStorage.setItem('username', username);
    onUpdate({ avatarUrl, username, email });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-2">
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </div>

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
