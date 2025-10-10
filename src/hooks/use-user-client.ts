"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";

type UseUserClientResult = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function useUserClient(): UseUserClientResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/customer");
        setUser(res.data.user || null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
