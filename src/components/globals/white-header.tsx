/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SearchContainer from "./search-container";
import { useRouter } from "next/navigation";

const WhiteHeader = ({
  showSearch,
  items,
  loading,
  user,
  customer,
}: {
  showSearch: boolean;
  items: number;
  loading: boolean;
  user: any;
  customer: any;
}) => {
  const router = useRouter();
  return (
    <div className="px-60 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              alt="Logo"
              src="/images/logo-dark.png"
              fill
              className="size-full"
            />
          </div>
          <div className="text-xl font-bold">1 Market Philippines</div>
        </Link>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchContainer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => router.push("/shopping-cart")}
          className={`cursor-pointer relative text-black hover:text-[#800020] flex items-center gap-2`}
        >
          <ShoppingCart className={`w-6 h-6 `} />({items})
        </button>
        {loading ? (
          // Loading skeleton for user section
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full bg-gray-300 animate-pulse `}
            />
            <div className={`h-4 w-20 rounded bg-gray-300 animate-pulse `} />
          </div>
        ) : user ? (
          <Link
            href="/my-account"
            className="cursor-pointer flex text-black hover:text-[#800020] items-center gap-2"
          >
            <User className="w-6 h-6 inline-block mr-1" />
            Hi,{" "}
            {customer?.firstName ||
              customer?.lastName ||
              user.email?.split("@")[0] ||
              "User"}
            !
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="cursor-pointer flex text-black hover:text-[#800020] items-center gap-2"
            >
              <User className="w-6 h-6" />
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-[#800020] hover:bg-[#800020]/80 px-4 py-2 rounded-full cursor-pointer text-white"
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default WhiteHeader;
