'use client';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import CreatePostForm from '@/components/form/CreatePostForm';

export default function SearchHashtag() {
  const [selectedItemHashtag, setSelectedItemHashtag] = useState<string | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  const items = [
    'Calendar',
    'Search Emoji',
    'Calculator',
    'Profile',
    'Billing',
    'Settings',
    'Run away',
    'Profile',
    'Billing',
    'Settings',
    'Run away',
    'Profile',
    'Billing',
    'Settings',
    'Run away',
  ];

  const visibleItems = showAll ? items : items.slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl p-4">
      {!selectedItemHashtag ? (
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Search hashtag ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="All my challenges">
              {visibleItems.map((label, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => setSelectedItemHashtag(label)}
                >
                  <span># {label}</span>
                </CommandItem>
              ))}
              {items.length > 4 && (
                <CommandItem
                  className="cursor-pointer text-blue-600"
                  onSelect={() => setShowAll(!showAll)}
                >
                  {showAll ? 'See Less' : 'See More'}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      ) : (
        <CreatePostForm
          selectedItemHashtag={selectedItemHashtag}
          setSelectedItemHashtag={setSelectedItemHashtag}
        />
      )}
    </div>
  );
}
