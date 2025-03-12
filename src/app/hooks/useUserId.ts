import { useState, useEffect } from "react";

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra xem đang chạy trên client hay server
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));

      const handleStorageChange = () => {
        setUserId(localStorage.getItem("userId"));
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  return userId;
}
