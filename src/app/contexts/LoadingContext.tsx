'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import FullScreenLoading from '@/components/FullScreenLoading';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <FullScreenLoading isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
