/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import Image from "next/image";
import { ZapIcon, History, ScrollTextIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i4/O1CN01PogENa20bb28NCZwL_!!6000000006868-0-tps-3840-800.jpg"
            alt="Money back policy"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-52 ml-8 mt-32 text-white">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="rounded-full relative size-16">
                    <Image
                      src="https://china-southnorth-01.oss-cn-zhangjiakou.aliyuncs.com/intl-social-service/26/143003/20221221/dbd187d6c6dd4795899c2fbac6b80b75-helphub-1671593646203-rc-upload-1671586634092-40"
                      alt="Money back policy icon"
                      fill
                      className="size-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-2xl">Purchase Protection</p>
                </div>
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  Money-back policy
                </h1>
                <p className="max-w-lg text-lg mb-6">
                  We will assist you in reaching a satisfactory resolution,
                  including refunds or compensation, for product quality issues
                  or other breaches of our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-16 px-12">
          <h2 className="text-4xl font-bold tracking-tighter">Refund policy</h2>
          <p className="text-xl mt-2">
            Claim refunds if orders haven't been shipped, are missing, or arrive
            with product issues (e.g., defective, incorrect, damaged, etc.).
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <History className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">30 or 60-day refunds</h3>
              </div>
              <p>
                You are entitled to refunds within 30 or 60 days from the
                delivery date depending on the seller's policy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <ZapIcon className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Quick refunds</h3>
              </div>
              <p>
                If you cancel within 2 hours of payment and the order has not
                yet shipped, you can claim a full and immediate refund.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <ScrollTextIcon className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Resolution support</h3>
              </div>
              <p>
                If there's a problem with your refund, we will help mediate to
                get your money back.
              </p>
            </div>
          </div>
          {/* How to apply for a refund */}
          <div className="mt-16">
            <h1 className="text-2xl sm:text-3xl font-bold mb-12">
              How to apply for a refund
            </h1>
            <div>
              {/* Step 01 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Apply for refund if order doesn't meet the agreed terms
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Go to My orders {">"} Order details to apply.
                  </p>
                  <div className="bg-zinc-200 p-6 h-96 rounded-lg shadow-sm border"></div>
                </div>
              </div>

              {/* Step 02 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Negotiate with seller or request refund
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    If the seller does not respond or you are unable to reach a consensus, escalate the case for 1 Market Philipines to help resolve.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Get your money back
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Receive your refund after the case is processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
