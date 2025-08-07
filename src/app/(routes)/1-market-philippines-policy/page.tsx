import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// Dynamically import the client-only component that uses useSearchParams.
// ssr: false is the key to preventing the build error.
const PolicyContent = dynamic(() => import('./policy-content'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[300px] py-10">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
    </div>
  ),
});

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="absolute inset-0 flex items-center">
            <div className="pl-40 mt-32 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl capitalize md:text-5xl font-bold mb-4">
                    Policy
                  </h1>
                  <p className="max-w-3xl text-lg mb-6">
                    Learn about the policies and regulations that govern the
                    market in the Philippines. This section provides insights
                    into the legal framework, compliance requirements, and best
                    practices for businesses operating in this region.
                  </p>
                </div>
                <div className="relative size-[400px] ml-80">
                  <Image
                    src="/policy.png"
                    alt="Policy"
                    fill
                    className="size-full shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
          Render the dynamically imported component here.
          The Suspense boundary is still good practice for client-side loading,
          but the ssr: false is what prevents the build from failing.
        */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[300px] py-10">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
          </div>
        }>
          <PolicyContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
