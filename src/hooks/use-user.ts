"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client"; // This is your client-side Supabase client
import { User } from "@prisma/client"; // Assuming this is your Prisma model type

type SupabaseUserMetadata = {
  name?: string;
  avatar_url?: string;
  // Add other metadata fields you might use
  first_name?: string; // If you store first/last in metadata
  last_name?: string;
};

type SupabaseUserData = {
  id: string;
  email: string;
  user_metadata: SupabaseUserMetadata;
};

export function useUser() {
  // `customer` is your Prisma DB user record
  const [customer, setCustomer] = useState<User | null>(null);
  // `supabaseUser` is the user object directly from Supabase auth
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUserData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCustomer(null); // Clear previous customer data on refetch
    setSupabaseUser(null); // Clear previous Supabase user data

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        // User is not logged in or session expired
        setLoading(false);
        setSupabaseUser(null);
        setCustomer(null);
        return;
      }

      // User is logged in via Supabase
      const { user: supabaseAuthUser } = session; // Get user directly from session

      setSupabaseUser({
        id: supabaseAuthUser.id,
        email: supabaseAuthUser.email || "",
        user_metadata: supabaseAuthUser.user_metadata || {}, // Ensure it's an object
      });

      // Now fetch customer details from your backend using the session token
      try {
        const response = await fetch("/api/v1/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`, // Pass access token for verification on backend
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          // If customer record not found (e.g., new Supabase user but no DB entry)
          if (
            response.status === 404 &&
            errorData.code === "CUSTOMER_NOT_FOUND"
          ) {
            console.warn(
              "No corresponding customer DB record found for Supabase user. You might need to create it."
            );
            // Optionally, here you could trigger a user creation flow
            setCustomer(null); // Explicitly set customer to null if not found
            return;
          }
          // For other errors during customer fetch
          throw new Error(
            errorData.message || "Failed to fetch customer details from DB."
          );
        }

        const { data: customerData } = await response.json();
        setCustomer(customerData); // Set your Prisma DB customer data
      } catch (err) {
        console.error("Error fetching customer details from API:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load customer profile."
        );
      }
    } catch (err) {
      console.error("Supabase session or user fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Authentication check failed."
      );
    } finally {
      setLoading(false); // Ensure loading is always set to false when fetch completes
    }
  }, []); // No dependencies are needed here, as it's meant to refetch all user data

  useEffect(() => {
    fetchUserData(); // Initial fetch on component mount
  }, [fetchUserData]); // Dependency array to prevent infinite loop (fetchUserData is memoized)

  return {
    customer, // Your Prisma DB user data (firstName, lastName, etc.)
    user: supabaseUser, // Raw user data from Supabase auth (email, user_metadata, etc.)
    loading,
    error,
    refetch: fetchUserData, // Allow manual refetching
  };
}
