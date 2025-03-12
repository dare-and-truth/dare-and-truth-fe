'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  // Xử lý thay đổi Username
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Không cho nhập quá 50 ký tự
    if (value.length > 30) return;

    setUsername(value);

    if (value.trim() === '') {
      setUsernameError('Username can not be empty');
    } else {
      setUsernameError('');
    }
  };

  // Xử lý thay đổi Email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value.trim() === '') {
      setEmailError('Email can not be empty');
    } else if (!validateEmail(value)) {
      setEmailError('Email format is incorrect');
    } else {
      setEmailError('');
    }
  };

  // Xử lý chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFileToSupabase(file);
      console.log('Uploaded file URL:', uploadedUrl); // Debug URL
      if (uploadedUrl) setAvatarUrl(uploadedUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setIsUploading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setAvatarUrl(user.avatarUrl);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [isOpen, user]);

  // Xử lý submit
  const handleSubmit = async () => {
    // Validate các trường bắt buộc
    if (username.trim() === '' || email.trim() === '' || !validateEmail(email)) {
      return;
    }
  
    // Nếu dữ liệu không thay đổi so với ban đầu, chỉ đóng popup mà không gọi API cập nhật
    if (avatarUrl === user.avatarUrl && username === user.username && email === user.email) {
      onClose();
      return;
    } 

    // console.log("avatarurrl trogn submit",avatarUrl);
  
    // Nếu avatar được thay đổi, chỉ cập nhật avatarUrl mới, ngược lại giữ nguyên giá trị ban đầu
    const updatedUserData = {
      avatarUrl: avatarUrl !== user.avatarUrl ? avatarUrl : user.avatarUrl,
      username,
      email,
    };
  
    // Cập nhật localStorage nếu cần
    localStorage.setItem('avatarUrl', updatedUserData.avatarUrl);
    localStorage.setItem('username', username);
    
    console.log('Before update:', user);
    console.log('Updating with:', { updatedUserData });

    // Gọi API update với dữ liệu đã thay đổi
    onUpdate(updatedUserData);
    onClose();
  };

  // Kiểm tra nếu username hoặc email không hợp lệ thì disable nút Save
  const isSaveDisabled = username.trim() === '' || email.trim() === '' || !validateEmail(email);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-2">
          <img src={avatarUrl?.trim() ? avatarUrl : '/images/default-profile.png'} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full object-cover" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
          <Button variant="join" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </div>

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <Input value={username} onChange={handleUsernameChange} />
          {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input type="email" disabled value={email} onChange={handleEmailChange} />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="join" onClick={handleSubmit} disabled={isSaveDisabled}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
