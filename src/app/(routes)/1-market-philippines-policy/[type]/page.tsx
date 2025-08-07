import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import PolicyContent from "./policy-content";

// The Page component receives the dynamic parameters from the URL directly as a prop
const Page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const { type } = await params;
  const formattedType = type.toLowerCase().replace(/ /g, "-");

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
                    {type}
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
        {/* Pass the 'type' as a prop to the Client Component */}
        <PolicyContent type={formattedType} />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
