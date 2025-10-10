"use client";

import { ChevronDown } from "lucide-react";
import { MdFiberNew } from "react-icons/md";
import { FaMedal } from "react-icons/fa6";
import { FaTags } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FeaturedSelectionsDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const FeaturedSelectionsDropdown = ({
  isOpen,
  setIsOpen,
}: FeaturedSelectionsDropdownProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <button
        className="hover:text-[#800020] cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>Featured selections</span>
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
              <div className="lg:col-span-8 pr-10">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
                  <div onClick={() => router.push("/top-ranking")} className="p-5 cursor-pointer hover:bg-zinc-100 w-full h-[20vh] flex items-center flex-col justify-center gap-5 border">
                    <FaMedal className="size-8" />
                    <span className="text-lg">Top ranking</span>
                  </div>
                  <div onClick={() => router.push("/new-arrivals")} className="p-5 cursor-pointer hover:bg-zinc-100 w-full h-[20vh] flex items-center flex-col justify-center gap-5 border">
                    <MdFiberNew className="size-8" />
                    <span className="text-lg">New arrivals</span>
                  </div>
                  <div onClick={() => router.push("/top-deals")} className="p-5 cursor-pointer hover:bg-zinc-100 w-full h-[20vh] flex items-center flex-col justify-center gap-5 border">
                    <FaTags className="size-8" />
                    <span className="text-lg">Top deals</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 border-l space-y-5 flex flex-col justify-center pl-10">
                <Link
                  href="/campaign"
                  className="text-base hover:text-[#800020]"
                >
                  Campaign
                </Link>
                <Link
                  href="/product-listings"
                  className="text-base hover:text-[#800020]"
                >
                  Product listings
                </Link>
                <Link
                  href="/services-offered"
                  className="text-base hover:text-[#800020]"
                >
                  Services offered
                </Link>
                <Link
                  href="/products-you-may-like"
                  className="text-base hover:text-[#800020]"
                >
                  Items you may like
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedSelectionsDropdown;
