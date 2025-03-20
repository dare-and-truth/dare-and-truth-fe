'use client';
import React, { createContext, useContext, useState } from 'react';
import { FeedType } from '@/app/types';

interface FeedContextType {
  feeds: FeedType[];
  setFeeds: React.Dispatch<React.SetStateAction<FeedType[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [feeds, setFeeds] = useState<FeedType[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  return (
    <FeedContext.Provider
      value={{ feeds, setFeeds, page, setPage, hasMore, setHasMore }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeedContext() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeedContext must be used within a FeedProvider');
  }
  return context;
}
