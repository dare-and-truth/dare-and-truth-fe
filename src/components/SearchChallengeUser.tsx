'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarMenuItem } from '@/components/ui/sidebar';

export function SearchChallengeUser() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <SidebarMenuItem className="p-1 mt-1">
      <form onSubmit={handleSearch} className="relative flex">
        <button
          type="submit"
          className="rounded-l-md border border-gray-300 bg-gray-100 px-2 text-gray-700 hover:bg-gray-200 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Search className="h-4 w-4" />
        </button>
        <input
          type="search"
          placeholder="  Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-r-md border border-gray-300 py-2 shadow-sm focus:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-100"
        />
      </form>
    </SidebarMenuItem>
  );
}
