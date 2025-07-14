"use client";
import React from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import Footer from "@/components/globals/footer";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[80vh] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i1/O1CN01I96Ugt1mIuFYWS4N0_!!6000000004932-0-tps-3840-1360.jpg"
            alt="Purchase Protection"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-52 ml-8 text-white">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="rounded-full relative size-16">
                    <Image
                      src="https://china-southnorth-01.oss-cn-zhangjiakou.aliyuncs.com/intl-social-service/26/143003/20221221/dbd187d6c6dd4795899c2fbac6b80b75-helphub-1671593646203-rc-upload-1671586634092-40"
                      alt="Purchase Protection icon"
                      fill
                      className="size-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-2xl">Purchase Protection</p>
                </div>
                <h1 className="text-2xl md:text-5xl font-bold mb-4 max-w-xl">
                  Enjoy peace of mind with our purchase protection.
                </h1>
                <Button size="lg" className="rounded-full mt-5">
                  <Video />
                  See how it works
                </Button>
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
