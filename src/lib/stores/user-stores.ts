'use client';

import { create } from 'zustand';

interface UserState {
  userStatus: boolean;
  userDetails: {
    displayName: string;
    avatarURL?: string;
  };
  setUserDetails: (details: {
    displayName: string;
    avatarURL?: string;
  }) => void;
  setUserStatus: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userStatus: true, // Set to true for demo purposes
  userDetails: {
    displayName: 'current_user',
    avatarURL: 'https://i.pravatar.cc/150?img=7',
  },
  setUserDetails: (details) => set({ userDetails: details }),
  setUserStatus: (status) => set({ userStatus: status }),
}));
