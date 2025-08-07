import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import PolicyClientPage from "./client";

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
        {/* Render the new client component here */}
        <PolicyClientPage />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
