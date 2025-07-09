"use client";

import React from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import Image from "next/image";
import { HandCoins, Warehouse, ChartSpline } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i1/O1CN01RrtGbY1MnQdThpd0u_!!6000000001479-0-tps-3840-800.jpg"
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
                  On-time Shipping
                </h1>
                <p className="max-w-lg text-lg mb-6">
                  We support local community-wide delivery riders to ensure your
                  orders arrive on time and in perfect condition.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-16 px-12">
          <h2 className="text-4xl font-bold tracking-tighter">
            On-time Delivery Guarantee
          </h2>
          <p className="text-xl mt-2">
            Claim and automatically receive compensation for delays in
            deliveries, without having to negotiate with the seller.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <Warehouse className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Inventory management</h3>
              </div>
              <p>
                Better plan out and manage inventory knowing orders will be
                delivered on time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <HandCoins className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">
                  Compensation for delays
                </h3>
              </div>
              <p>
                If late delivery occurs, receive a coupon which can be used for
                future purchases.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <ChartSpline className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Simplified process</h3>
              </div>
              <p>
                Our team reviews your claim directly, saving you time spent
                negotiating with sellers.
              </p>
            </div>
          </div>
          {/* How it works */}
          <div className="mt-16">
            <h1 className="text-2xl sm:text-3xl font-bold mb-12">
              How it works
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
                      Find products that support On-time Delivery Guarantee
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Look for products with the On-time Delivery Guarantee badge.
                    These products are eligible for compensation if they are not
                    delivered on time.
                  </p>
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
                      Pay using your preferred payment method through our
                      platform.
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Make your purchase using any of the supported payment
                    methods. Ensure you complete the transaction through our
                    platform to be eligible for the guarantee.
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
                      Make a claim if delays occur
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    If products are not delivered by the agreed date, go to My
                    orders {">"} Order details to make a claim.
                  </p>
                  <div className="bg-zinc-200 p-6 h-96 rounded-lg shadow-sm border"></div>
                </div>
              </div>

              {/* Step 04 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Get compensation
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Collect platform coupons that can be used on future 1 Market Philippines purchases.
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
