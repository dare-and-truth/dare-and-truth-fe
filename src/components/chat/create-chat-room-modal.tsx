'use client';

import type React from 'react';

import { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/lib/stores/user-stores';
import { useChatStore } from '@/lib/stores/chat-stores';


interface CreateChatRoomModalProps {
  setCreateChatRoom: (open: boolean) => void;
}

export function CreateChatRoomModal({
  setCreateChatRoom,
}: CreateChatRoomModalProps) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [searchedUser, setSearchedUser] = useState(false);
  const [selected, setSelected] = useState(false);
  const [searchedUserData, setSearchedUserData] = useState<any>(null);

  const { userDetails } = useUserStore();
  const { createChatRoom, checkChatRoomExists } = useChatStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      setError('Please enter a username');
      setSearchedUser(false);
      return;
    }

    try {
      const result = await checkChatRoomExists(
        search,
        userDetails.displayName || '',
      );

      if (result.exists) {
        setError('Chat room already exists');
        setSearchedUser(false);
      } else if (result.user) {
        setSearchedUserData(result.user);
        setSearchedUser(true);
        setError('');
      } else {
        setError('User not found');
        setSearchedUser(false);
      }
    } catch (err) {
      setError('Error searching for user');
      setSearchedUser(false);
    }
  };

  const handleCreateChatRoom = async () => {
    if (!searchedUserData || !userDetails.displayName) return;

    try {
      await createChatRoom(searchedUserData, userDetails.displayName);
      setCreateChatRoom(false);
    } catch (err) {
      setError('Failed to create chat room');
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center bg-[#0000008f] dark:bg-[#000000d7]">
      <div className="w-[400px] rounded-xl bg-white dark:border dark:border-stone-300 dark:bg-[#000000]">
        <div className="flex items-center justify-between border-b border-stone-300 p-3 dark:border-stone-700">
          <button
            onClick={() => setCreateChatRoom(false)}
            type="button"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="font-bold">New message</p>
          <button
            className={`${selected ? 'text-[#0095f6]' : 'pointer-events-none opacity-50'}`}
            type="button"
            onClick={handleCreateChatRoom}
            disabled={!selected}
          >
            Create
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between border-b border-stone-300 py-5 dark:border-stone-700">
          <form onSubmit={handleSearch} className="flex-1">
            <label
              className="flex items-center pl-3 text-lg"
              htmlFor="searchForUser"
            >
              To:
              <input
                className="ml-5 flex-1 text-sm focus:outline-none dark:bg-[#131313]"
                type="text"
                id="searchForUser"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </form>
          <button
            className="mr-5"
            type="button"
            onClick={handleSearch}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div>
          {searchedUser ? (
            <div className="mb-3 p-3">
              <p className="pb-3 font-bold">Result:</p>
              <div className="flex items-center justify-start">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={searchedUserData.avatarURL || ''}
                    alt={`${searchedUserData.username}'s profile`}
                  />
                  <AvatarFallback className="bg-[#efefef] dark:bg-[#070707]">
                    {searchedUserData.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="ml-3 mr-auto">{searchedUserData.username}</p>
                <button
                  onClick={() => setSelected(!selected)}
                  type="button"
                  aria-label={selected ? 'Deselect user' : 'Select user'}
                  className={`h-6 w-6 rounded-full border ${
                    selected
                      ? 'border-[#0095f6] bg-[#0095f6] text-white'
                      : 'border-gray-300'
                  } flex items-center justify-center`}
                >
                  {selected && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : (
            <p className="p-3 font-bold text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
