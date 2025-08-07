'use client';

import React from "react";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";
import { Suspense } from 'react';

const PolicyContent = dynamic(() => import('./policy-content'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[300px] py-10">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
    </div>
  ),
});

const PolicyClientPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[300px] py-10">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
      </div>
    }>
      <PolicyContent />
    </Suspense>
  );
};

export default PolicyClientPage;
