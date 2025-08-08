"use client";
import React, { useState } from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ACCOUNTHELP, MAINCONTENT, ORDERHELP, PAYMENTHELP, POLICIESHELP, PRODUCTHELP, RETURNHELP, SECURITYHELP, SHIPPINGHELP, TOPICS } from "@/data/help-center";
import HeaderDesign from "@/components/globals/header-design";
import AccordionContent from "@/components/globals/accordion-content";
import Footer from '@/components/globals/footer';

const Page = () => {
  const [selectedTopic, setSelectedTopic] = useState("order");
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className='relative'>
        <Header />
        <div className="w-full lg:h-[280px] h-[240px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="/images/top-banner.webp"
            alt="FAQS"
            fill
            className="size-full object-cover"
            priority
          />
          <div className="absolute z-50 lg:mt-36 mt-20 lg:px-20 px-10 top-0 left-0">
            <p className="text-4xl mt-5 text-white">Hi, how can we help you?</p>
            <p className="text-zinc-300 mt-2">
              Select a topic to get help with items, shipping, return or refund
              problems, etc.
            </p>
          </div>
        </div>
        <section className="mt-10 lg:px-20 px-10">
          <div className="flex items-center gap-4">
            <HeaderDesign />
            <h3 className="text-[#800020] font-semibold text-2xl">
              Recommended topics
            </h3>
            <HeaderDesign />
          </div>
          <div className="mt-5 grid md:grid-cols-2 grid-cols-1 gap-x-10 gap-y-4">
            {MAINCONTENT.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedTopic(item.id)}
                className="border px-4 text-zinc-800 border-zinc-300 cursor-pointer hover:bg-accent py-4 rounded-sm flex items-center justify-between"
              >
                <p>{item.label}</p>
                <ChevronRight className="size-4" />
              </div>
            ))}
          </div>
        </section>
        <section className="mt-10 lg:pb-20 pb-10 lg:px-20 px-10">
          <div className="flex items-center gap-4">
            <HeaderDesign />
            <h3 className="text-[#800020] font-semibold text-2xl">
              All help topics
            </h3>
            <HeaderDesign />
          </div>
          <div className="grid md:grid-cols-10 mt-5 grid-cols-1 gap-10">
            <div className="md:col-span-2 flex flex-col gap-y-2">
              {TOPICS.map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  className={`flex items-center rounded-sm px-2 py-2 justify-between gap-2 cursor-pointer ${selectedTopic === id ? "bg-zinc-200" : "hover:bg-zinc-200"}`}
                  onClick={() => setSelectedTopic(id)}
                >
                  <div className="flex text-sm items-center gap-2">
                    <Icon className="size-4" />
                    {label}
                  </div>
                  <ChevronRight className="size-4" />
                </div>
              ))}
            </div>
            <div className="md:col-span-8">
              {selectedTopic === "order" && (
                <div className="flex flex-col gap-4">
                  {ORDERHELP.map((item, index) => {
                    const value = `order-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "shipping" && (
                <div className="flex flex-col gap-4">
                  {SHIPPINGHELP.map((item, index) => {
                    const value = `shipping-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "return" && (
                <div className="flex flex-col gap-4">
                  {RETURNHELP.map((item, index) => {
                    const value = `return-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "product" && (
                <div className="flex flex-col gap-4">
                  {PRODUCTHELP.map((item, index) => {
                    const value = `product-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "account" && (
                <div className="flex flex-col gap-4">
                  {ACCOUNTHELP.map((item, index) => {
                    const value = `account-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "payment" && (
                <div className="flex flex-col gap-4">
                  {PAYMENTHELP.map((item, index) => {
                    const value = `payment-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "security" && (
                <div className="flex flex-col gap-4">
                  {SECURITYHELP.map((item, index) => {
                    const value = `security-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
              {selectedTopic === "policies" && (
                <div className="flex flex-col gap-4">
                  {POLICIESHELP.map((item, index) => {
                    const value = `policies-${index}`;
                    return (
                      <AccordionContent
                        key={index}
                        title={item.title}
                        value={value}
                        description={item.description}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
