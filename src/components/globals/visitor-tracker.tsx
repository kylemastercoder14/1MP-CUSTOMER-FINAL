"use client"

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Determine platform (simple example - you might want to use a more robust detection)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const platform = isMobile ? 'Mobile' : 'Desktop';

        // Call tracking API
        await fetch('/api/v1/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platform }),
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);

  // This component doesn't render anything
  return null;
}
