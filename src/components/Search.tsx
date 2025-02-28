'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import { SearchBarProps } from '@/app/types';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placehoder,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 1200);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <Input
        type="text"
        placeholder={placehoder}
        className="w-80 pl-10"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}
