"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@prisma/client";

type UserData = {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

export function useUser() {
  const [customer, setCustomer] = useState<User | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setLoading(false);
        return; // No session, user is not logged in
      }

      // Get Supabase user data
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);

      if (userData.user) {
        setUser({
          id: userData.user.id,
          email: userData.user.email || "",
          user_metadata: userData.user.user_metadata,
        });

        try {
          const response = await fetch("/api/v1/customer", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.warn(
              "Customer fetch failed, but user is authenticated:",
              errorData.message
            );
            // Still continue even if customer fetch fails
            return;
          }

          const { data: customerData } = await response.json();
          setCustomer(customerData);
        } catch (err) {
          console.warn("Failed to fetch customer details:", err);
          // Continue even if customer fetch fails
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  return {
    customer,
    user,
    loading,
    error,
    refetch: fetchCustomerDetails,
  };
}
