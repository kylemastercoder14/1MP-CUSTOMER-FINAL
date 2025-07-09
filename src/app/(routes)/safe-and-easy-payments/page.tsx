/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import { ClockIcon, HeadsetIcon, ShieldAlert } from "lucide-react";
import Footer from '@/components/globals/footer';

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i2/O1CN01jRIyKo21SiyaabZgZ_!!6000000006984-0-tps-3840-800.jpg"
            alt="Safe and easy payments"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Blurred overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-52 ml-8 mt-24 text-white">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                <h1 className="text-xl md:text-2xl font-bold mb-2">
                  Secure Checkout
                </h1>
                <h2 className="text-lg md:text-xl font-semibold mb-1">
                  Safe & easy payments
                </h2>
                <p className="text-sm mb-6">
                  Pay using your preferred payment method with our secure Xendit
                  integration
                </p>

                {/* Xendit payment methods */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="bg-white/20 p-3 rounded-md flex items-center">
                    <Image
                      src="/icons/credit-card.svg"
                      alt="Credit Cards"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    <span>Credit/Debit Cards</span>
                  </div>
                  <div className="bg-white/20 p-3 rounded-md flex items-center">
                    <Image
                      src="/icons/bank.svg"
                      alt="Bank Transfer"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="bg-white/20 p-3 rounded-md flex items-center">
                    <Image
                      src="/icons/e-wallet.svg"
                      alt="E-Wallets"
                      width={24}
                      height={16}
                      className="mr-2"
                    />
                    <span>E-Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment features section */}
        <div className="container mx-auto py-16 px-10">
          <h2 className="text-3xl font-bold">
            How we keeps your payments secure and simple
          </h2>
          <p className="mb-7 text-muted-foreground mt-2">
            Every payment made through 1 Market Philippines is SSL-encrypted,
            PCI DSS compliant, and processed in as quickly as 2 hours. To
            protect your payment, never pay outside of the platform.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <ShieldAlert className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Secure Payments</h3>
              </div>
              <p>
                Xendit&apos;s PCI-compliant platform ensures your payment
                information is always protected.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <ClockIcon className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Instant Processing</h3>
              </div>
              <p>
                Most payments are processed instantly so you can complete your
                purchase without delay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-3">
                <HeadsetIcon className="text-[#800020] mr-2" size={24} />
                <h3 className="text-xl font-semibold">Dedicated Support</h3>
              </div>
              <p>
                Our team is ready to help with any payment questions or issues
                you may encounter.
              </p>
            </div>
          </div>
          {/* Secure Payment Process Section */}
          <div className="mt-16">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              How to make secure payments with Xendit
            </h1>
            <p className="text-gray-600 mb-12">
              Your payment security is guaranteed with our PCI-compliant payment gateway
            </p>

            <div>
              {/* Step 01 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#800020] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Choose your products and add to cart
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Browse through our marketplace and select the items you want to purchase.
                    All transactions are protected by our secure payment infrastructure.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Note:</strong> All product has a feature of "Secure Checkout"
					  to ensure your payment is processed securely.
                    </p>
                  </div>
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
                      Proceed to secure checkout
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Review your order details and shipping information. Our checkout process
                    is SSL-encrypted and PCI DSS compliant for maximum security.
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
                      Pay using your preferred payment method
                    </h2>
                  </div>
                </div>
                <div className="ml-14 pb-8">
                  <p className="text-gray-600 mb-4">
                    Choose from multiple secure payment options powered by Xendit.
                    All payment methods are tokenized and never stored on our servers.
                  </p>
                  <div className="bg-zinc-200 p-6 h-96 rounded-lg shadow-sm border">
                  </div>
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
