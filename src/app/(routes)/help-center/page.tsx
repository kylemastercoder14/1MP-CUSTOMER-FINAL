"use client";

import React, { useState } from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MessageCircle,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TabKey } from '@/types';
import { tabContent, tabs } from '@/constants';
import Footer from '@/components/globals/footer';

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("My Account");

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://china-southnorth-01.oss-cn-zhangjiakou.aliyuncs.com/intl-social-service/26/143003/20200416/7869abc19a4c4bbd8203b9d4f5d76f2d-helphub-1587013750729-rc-upload-1587006101888-128"
            alt="Help center"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Blurred overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Content */}
          <div className="absolute mt-20 inset-0 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 drop-shadow-lg">
                How can we help you?
              </h1>
              <div className="bg-white/90 backdrop-blur-md p-1 rounded-lg shadow-xl flex items-center border border-white/20">
                <div className="flex-1 flex">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter question or keyword..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-12 bg-white/90"
                    />
                    <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="border-l border-gray-200 mx-1">
                    <Select>
                      <SelectTrigger className="w-[180px] border-0 focus:ring-0 focus:ring-offset-0 h-12 py-6 shadow-none bg-white/90">
                        <SelectValue placeholder="Payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Payment">Payment</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="h-12 px-6 bg-[#800020] hover:bg-[#800020]/90 rounded-md ml-1">
                  Search
                </Button>
              </div>
              <p className="text-white text-center mt-4 text-sm drop-shadow-md">
                Popular searches: Account settings, Password reset, Payment
                issues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/faqs">FAQs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Help Center</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Learning Center */}
        <div className="mb-12 mt-5">
          <h2 className="text-2xl font-bold mb-6">Learning Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sourcing */}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full relative size-14">
                <Image
                  src="/cart.png"
                  alt="Purchase product"
                  fill
                  className="size-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1 mt-2">
                How to purchase products
              </h3>
              <p className="text-gray-600">Learn how to purchase products</p>
            </div>

            {/* Trade Assurance */}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full relative size-14">
                <Image
                  src="https://china-southnorth-01.oss-cn-zhangjiakou.aliyuncs.com/intl-social-service/26/143003/20221221/dbd187d6c6dd4795899c2fbac6b80b75-helphub-1671593646203-rc-upload-1671586634092-40"
                  alt="Purchase assurance"
                  fill
                  className="size-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1 mt-2">
                Purchase assurance
              </h3>
              <p className="text-gray-600">Protect your orders</p>
            </div>

            {/* Get the APP */}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full relative size-14">
                <Image
                  src="/phone.png"
                  alt="Get the APP"
                  fill
                  className="size-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1 mt-2">Get the APP</h3>
              <p className="text-gray-600">Download 1 Market Philippines APP</p>
            </div>

            {/* Logistics */}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full relative size-14">
                <Image
                  src="/bag.png"
                  alt="logistics work"
                  fill
                  className="size-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1 mt-2">
                How our logistics work
              </h3>
              <p className="text-gray-600">Supporting local community riders</p>
            </div>
          </div>
        </div>

        {/* Tabbed Section */}
        <div className="mb-12">
          {/* Tab Navigation */}
          <div className="flex flex-wrap bg-white rounded-t-lg shadow-sm border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "bg-[#800020]/90 text-white border-[#800020]"
                      : "text-gray-600 hover:text-[#800020]/50 border-transparent hover:bg-[#800020]/10"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tabContent[activeTab]?.map((item, index) => (
                <div
                  key={index}
                >
                  <Link
                    href="#"
                    className="text-gray-700 hover:text-[#800020] transition-colors"
                  >
                    • {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-6 w-6 text-[#800020]/50" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Online Service</h3>
              <p className="text-gray-600">24/7 Service for Buyer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-[#800020]/50" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Survey</h3>
              <p className="text-gray-600">Leave Feedback</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
