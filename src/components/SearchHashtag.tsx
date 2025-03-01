'use client';
import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import CreatePostForm from '@/components/form/CreatePostForm';
import { HashtagForDoChallengeResponse } from '@/app/types';
import { getHashtags } from '@/app/api/reminder.api';
import { Check } from 'lucide-react';

export default function SearchHashtag() {
  const [selectedItemHashtag, setSelectedItemHashtag] =
    useState<HashtagForDoChallengeResponse | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [hashtags, setHashtags] = useState<HashtagForDoChallengeResponse[]>([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const data = await getHashtags();
        setHashtags(data);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      }
    };

    fetchHashtags();
  }, []);

  const visibleItems = showAll ? hashtags : hashtags.slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl p-4">
      {!selectedItemHashtag ? (
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Search hashtag ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="All my challenges">
              {visibleItems.map((hashtag, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => setSelectedItemHashtag(hashtag)}
                  className={hashtag.did ? 'text-green-600' : ''}
                >
                  <span className="flex items-center gap-2">
                    # {hashtag.hashtag}
                    {hashtag.did && <Check className="h-4 w-4" />}
                  </span>
                </CommandItem>
              ))}
              {hashtags.length > 4 && (
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
          selectedItemHashtag={selectedItemHashtag.hashtag}
          setSelectedItemHashtag={setSelectedItemHashtag}
        />
      )}
    </div>
  );
}
