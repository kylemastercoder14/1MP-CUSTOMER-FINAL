"use client";

import {
  ArrowRight,
  ChevronDown,
  CreditCardIcon,
  RefreshCwIcon,
  ShieldIcon,
  TruckIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PurchaseProtectionsDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PurchaseProtectionsDropdown = ({
  isOpen,
  setIsOpen,
}: PurchaseProtectionsDropdownProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <button
        className="hover:text-[#800020] cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>Purchase protections</span>
        <ChevronDown
          className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 px-20 pt-5 pb-10 overflow-hidden right-0 mt-2 w-screen min-h-[300px] bg-white shadow-2xl z-50 border-t border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="grid lg:grid-cols-10 grid-cols-1 gap-5 pt-5">
              <div className="lg:col-span-5 pr-10">
                <div className="flex items-center gap-2 mb-2">
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
                <h2 className="text-3xl font-bold tracking-tighter max-w-xl">
                  Enjoy peace of mind with our purchase protection.
                </h2>
                <Button onClick={() => router.push("/puchase-protection")} className="px-14 rounded-full mt-7">Learn more</Button>
              </div>
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-6">
                  {/* Top row */}
                  <Link
                    href="/safe-and-easy-payments"
                    className="text-base w-full bg-accent hover:text-[#800020] flex items-center gap-3 p-4 rounded-lg transition-colors"
                  >
                    <div className="bg-[#800020]/10 p-3 rounded-full">
                      <CreditCardIcon className="size-7 text-[#800020]" />
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <span>Safe & easy payments</span>
                      <ArrowRight className="text-gray-700 size-5 ml-auto" />
                    </div>
                  </Link>

                  <Link
                    href="/money-back-policy"
                    className="text-base bg-accent hover:text-[#800020] flex items-center gap-3 p-4 rounded-lg transition-colors"
                  >
                    <div className="bg-[#800020]/10 p-3 rounded-full">
                      <RefreshCwIcon className="size-7 text-[#800020]" />
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <span>Money-back policy</span>
                      <ArrowRight className="text-gray-700 size-5 ml-auto" />
                    </div>
                  </Link>

                  {/* Bottom row */}
                  <Link
                    href="/on-time-shipping"
                    className="text-base bg-accent hover:text-[#800020] flex items-center gap-3 p-4 rounded-lg transition-colors"
                  >
                    <div className="bg-[#800020]/10 p-3 rounded-full">
                      <TruckIcon className="size-7 text-[#800020]" />
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <span>On-time shipping</span>
                      <ArrowRight className="text-gray-700 size-5 ml-auto" />
                    </div>
                  </Link>

                  <Link
                    href="/after-sales-protection"
                    className="text-base bg-accent hover:text-[#800020] flex items-center gap-3 p-4 rounded-lg transition-colors"
                  >
                    <div className="bg-[#800020]/10 p-3 rounded-full">
                      <ShieldIcon className="size-7 text-[#800020]" />
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <span>After-sales protections</span>
                      <ArrowRight className="text-gray-700 size-5 ml-auto" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchaseProtectionsDropdown;
