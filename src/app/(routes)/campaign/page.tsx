"use client";

import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <section>{/* Campaign */}</section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
