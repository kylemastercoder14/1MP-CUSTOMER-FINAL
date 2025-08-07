/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i2/O1CN01fJft1c1NhIxG9CPQf_!!6000000001601-0-tps-3840-800.jpg"
            alt="After sales protection"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-20 mt-32 text-white">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="rounded-full relative size-16">
                    <Image
                      src="https://china-southnorth-01.oss-cn-zhangjiakou.aliyuncs.com/intl-social-service/26/143003/20221221/dbd187d6c6dd4795899c2fbac6b80b75-helphub-1671593646203-rc-upload-1671586634092-40"
                      alt="After sales protection icon"
                      fill
                      className="size-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-2xl">Purchase Protection</p>
                </div>
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  After-sales protections
                </h1>
                <p className="max-w-lg text-lg mb-6">
                  Enjoy peace of mind with our after-sales protections, ensuring
                  your purchases are secure and hassle-free.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-16 px-20">
          <h2 className="text-4xl font-bold tracking-tighter">
            On-site service & free replacement parts
          </h2>
          <p className="text-xl mt-2">
            Receive additional support with our on-site installation,
            maintenance, repair, and free replacement parts services after
            purchasing a service through 1 Market Philippines. Service is
            provided in your local area or an installer will come to you. Claim
            compensation if the service received differs from the agreed terms.
          </p>
          <div className="flex items-start gap-2 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-md mt-4">
            {/* Warning Icon (using Heroicons exclamation-triangle) */}
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This after-sales protection applies only to
              services purchased through 1 Market Philippines. All products
              (including food, non-food, and digital items) purchased through
              other platforms are not eligible.
            </p>
          </div>
          {/* How to apply for after-sales service and support */}
          <div className="mt-16">
            <h1 className="text-2xl sm:text-3xl font-bold mb-12">
              How to apply for after-sales service and support
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
                      Find products that support after-sales services
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Find product that support "On-site service and free
                    replacement parts" or "Free replacement parts".
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
                      Apply for service
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Go to My orders {">"} Order details to fill in your request.
                  </p>
                  <div className="bg-zinc-200 p-6 h-96 rounded-lg shadow-sm border"></div>
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
                      Receive service
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Seller provides a solution, or you are eligible for
                    compensation. To view your after-sales requests, go to {">"}{" "}
                    Orders {">"} Refund Requests {">"} After-sales services.
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
