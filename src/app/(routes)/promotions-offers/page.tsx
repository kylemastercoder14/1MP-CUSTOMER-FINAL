"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg"
            alt="1MP"
            fill
            className="size-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/20"></div>
          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-40 mt-32 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-5xl font-bold mb-4">
                    One community, one market place.
                  </h1>
                  <p className="max-w-lg text-lg mb-6">
                    Easily browse, compare, and contact businesses to get what
                    you need—fast and conveniently. Join us in building a
                    stronger, more connected neighborhood!
                  </p>
                </div>
                <div className="relative size-96 ml-80">
                  <Image
                    src="/about.png"
                    alt="About 1MP"
                    fill
                    className="size-full shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
		<section className="py-20">
			Promotions and Offers
		</section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
