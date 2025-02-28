'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchChallengeUser() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <div className="relative mx-auto mt-2 max-w-sm">
      <form onSubmit={handleSearch} className="relative flex">
        <button
          type="submit"
          className="rounded-l-md border border-gray-300 bg-gray-100 px-4 text-gray-700 hover:bg-gray-200 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Search className="h-5 w-5" />
        </button>
        <input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-r-md border border-gray-300 px-4 py-2 shadow-sm focus:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-100"
        />
      </form>
    </div>
  );
}
