'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

// Use dynamic import to ensure PolicyContent is only loaded on the client
const PolicyContent = dynamic(() => import('./policy-content'), {
  ssr: false, // This is the key change: disables server-side rendering
  loading: () => (
    <div className="flex items-center justify-center min-h-[300px] py-10">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
    </div>
  ),
});

const PolicyContentWrapper = () => {
  return (
    // We still use Suspense for the initial client-side render,
    // but the dynamic import with ssr: false is what prevents the build error.
    <Suspense>
      <PolicyContent />
    </Suspense>
  );
};

export default PolicyContentWrapper;
