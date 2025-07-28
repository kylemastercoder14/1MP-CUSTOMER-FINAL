"use client";

import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  CircleEllipsis,
  CircleQuestionMark,
  FileText,
  HandCoins,
  MapPin,
  MessageCircleMoreIcon,
  ShieldCheck,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import Hint from "@/components/globals/hint";
import { Button } from '@/components/ui/button';
import {
  ACCOUNTHELP,
  ORDERHELP,
  PAYMENTHELP,
  POLICIESHELP,
  PRODUCTHELP,
  RETURNHELP,
  SECURITYHELP,
  SHIPPINGHELP,
} from "@/data/help-center";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden bg-gradient-to-r from-white to-zinc-300">
          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-40 mt-32 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-5xl font-bold mb-4">
                    Contact Us
                  </h1>
                  <p className="max-w-3xl text-lg mb-6">
                    We would love to hear from you! Whether you have a question,
                    feedback, or just want to say hello, feel free to reach out
                    to us. Our team is here to assist you with anything you
                    need.
                  </p>
                </div>
                <div className="relative size-[400px] ml-80">
                  <Image
                    src="/contact-us.png"
                    alt="Contact Us"
                    fill
                    className="size-full shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="bg-white py-20 px-20">
          <div className="mt-5 grid lg:grid-cols-2 lg:gap-20 gap-10 grid-cols-1">
            <div className="bg-white border rounded-md shadow-md px-10 py-5 flex lg:items-center gap-5">
              <div className="bg-[#800020] w-12 h-12 rounded-full flex shrink-0 items-center justify-center">
                <MessageCircleMoreIcon
                  fill="#fff"
                  className="w-6 h-6"
                  color="#800020"
                />
              </div>
              <div>
                <p className="font-semibold">Need help?</p>
                <p>
                  You can contact 1 Market Philippines customer service for
                  help.
                </p>
                <Link
                  href="mailto:onemarketphilippines2025@gmail.com"
                  className="text-[#800020] hover:underline flex items-center gap-1"
                >
                  Contact Us &rarr;
                </Link>
              </div>
            </div>
            <div className="bg-white border rounded-md shadow-md px-10 py-5 flex lg:items-center gap-5">
              <div className="bg-[#800020] w-12 h-12 rounded-full shrink-0 flex items-center justify-center">
                <MapPin fill="#fff" className="w-6 h-6" color="#800020" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Office Address</p>
                  <Hint text="Returns will not be accepted at this address.">
                    <CircleQuestionMark className="w-4 h- cursor-pointer text-muted-foreground" />
                  </Hint>
                </div>
                <p>
                  C-11 Manlunas St. Barangay 183, Pasay City, Metro Manila,
                  Philippines (+63 966 998 1628)
                </p>
                <Link
                  href="/how-to-return"
                  className="text-[#800020] hover:underline flex items-start"
                >
                  How to Return &rarr;
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-20 w-full">
            <h3 className="text-2xl tracking-tight font-semibold text-center">
              We are also available on social media
            </h3>
            <div className="mt-8 grid lg:grid-cols-4 grid-cols-1 gap-10">
              <Link href="#" className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://aimg.kwcdn.com/upload_aimg/bgp/a616bdc3-c84c-4cec-8739-37ee446d054a.png.slim.png?imageView2/2/w/144/q/70/format/webp"
                    alt="Instagram"
                    fill
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">1 Market Philippines Official</p>
                  <p className="text-sm">@1MPH</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://aimg.kwcdn.com/upload_aimg/bgp/9b80c2fd-5a4c-4f22-8fce-a49db2ba83c4.png.slim.png?imageView2/2/w/144/q/70/format/webp"
                    alt="Facebook"
                    fill
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">1 Market Philippines</p>
                  <p className="text-sm">@shop1mp</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://commimg-us.kwcdn.com/upload_commimg/temu_customer_service/twitter_3/11e07ee0-f3b7-42fd-a14e-368e802cdce1.png?imageView2/2/w/144/q/70/format/webp"
                    alt="X"
                    fill
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">1 Market Philippines</p>
                  <p className="text-sm">@shop1mp</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://aimg.kwcdn.com/upload_aimg/bgp/9da8ac45-225c-4b2e-bd56-1b50c796bf84.png.slim.png?imageView2/2/w/144/q/70/format/webp"
                    alt="Tiktok"
                    fill
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">1 Market Philippines Official</p>
                  <p className="text-sm">@1MPH</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="mt-20">
            <h3 className="text-center tracking-tight font-semibold text-2xl mt-12">
              Have a question? Well, {"we've"} got some answers.
            </h3>
            <div className="mt-12 w-full">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FileText className="size-4" />
                    </div>
                    <p>Order issues</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {ORDERHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <Truck className="size-4" />
                    </div>
                    <p>Shipping & Delivery</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {SHIPPINGHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <HandCoins className="size-4" />
                    </div>
                    <p>Return & Refund</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {RETURNHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <Archive className="size-4" />
                    </div>
                    <p>Product & Stock</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {PRODUCTHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <User className="size-4" />
                    </div>
                    <p>Managing My Account</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {ACCOUNTHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <Wallet className="size-4" />
                    </div>
                    <p>Payment & Promos</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {PAYMENTHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <ShieldCheck className="size-4" />
                    </div>
                    <p>Your Security</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {SECURITYHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-100 py-5 px-10">
                  {/* header */}
                  <div className="flex font-semibold items-center gap-3">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                      <CircleEllipsis className="size-4" />
                    </div>
                    <p>Policies & Others</p>
                  </div>
                  <div className="space-y-1 ml-10 mt-3 flex flex-col">
                    {POLICIESHELP.map((item, index) => (
                      <Link
                        key={index}
                        href="/help-center"
                        className="py-2 px-3 hover:bg-zinc-200"
                      >
                        {item.title} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-col items-center justify-center">
              <h3 className="text-center font-semibold text-2xl">
                {"Can't"} find the answer you are looking for?
              </h3>
              <Link
                href="mailto:onemarketphilippines2025@gmail.com"
                className="mt-6"
              >
                <Button
                  className="rounded-full h-14 w-44 text-base border-zinc-400 hover:border-black"
                  size="lg"
                  variant="outline"
                >
                  <MessageCircleMoreIcon className="size-7" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
