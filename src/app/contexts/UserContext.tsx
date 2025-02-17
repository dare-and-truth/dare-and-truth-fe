"use client";

import React, { createContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  // có thể thêm các trường khác nếu cần, ví dụ: username, role, v.v.
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
