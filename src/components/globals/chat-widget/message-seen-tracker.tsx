"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MessageSeenTrackerProps {
  messageId: string;
  isSeen: boolean;
  isCurrentUser: boolean;
}

export const MessageSeenTracker = ({
  messageId,
  isSeen,
  isCurrentUser,
}: MessageSeenTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // This is the function that will call your backend API
  const markMessageAsSeen = useCallback(async () => {
    // Only proceed if the message hasn't been marked as seen yet and it's not the current user's message
    if (isSeen || isCurrentUser || loading) {
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/messages/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark message as seen");
      }

      // If successful, you might want to do something here, like update a local state
      console.log(`Message ${messageId} marked as seen successfully.`);

    } catch (error) {
      console.error("Error marking message as seen:", error);
    } finally {
      setLoading(false);
    }
  }, [messageId, isSeen, isCurrentUser, loading]);

  useEffect(() => {
    // Ensure we don't observe the element if the message is already seen or it's the current user's message
    if (isSeen || isCurrentUser) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Call the API function when the element comes into view
          markMessageAsSeen();
          // Disconnect the observer once the API call is triggered
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [markMessageAsSeen, isSeen, isCurrentUser]);

  return <div ref={ref} className="absolute bottom-0 right-0 h-4 w-4" />;
};
