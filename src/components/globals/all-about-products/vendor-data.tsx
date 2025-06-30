"use client";

import { CheckIcon, Mails, Send, Star, StoreIcon, Users } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { ProductWithProps } from "@/types";
import Image from 'next/image';

const VendorData = ({ product }: { product: ProductWithProps | null }) => {
  return (
    <div className="bg-white mt-3 rounded-md border px-3 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="relative size-10 rounded-full">
          <Image src={product?.vendor.image || ""} alt={product?.vendor.name || ""} fill className='size-full object-cover rounded-full' />
        </div>
        {/* TODO: Vendor Data */}
        <div>
          <span>{product?.vendor.name}</span>
          <div className="flex items-center gap-2">
            {product?.vendor.adminApproval === "Approved" ? (
              <span className="bg-green-200 mt-1 text-green-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
                <CheckIcon className="inline size-3 mr-1" />
                Verified Seller
              </span>
            ) : (
              <span className="bg-zinc-200 mt-1 text-zinc-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
                Not Verified
              </span>
            )}
            <span className="bg-amber-200 mt-1 text-amber-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
              <Star className="inline size-3 mr-1 fill-current" />
              Seller Ratings 96%
            </span>
            <span className="bg-blue-200 mt-1 text-blue-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
              <Users className="inline size-3 mr-1" />
              Followers 274
            </span>
            <span className="bg-[#644117]/20 mt-1 text-[#644117] text-xs px-1.5 py-0.5 font-medium rounded-md">
              <Mails className="inline size-3 mr-1" />
              Quick replies: Avg. 36 mins
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-[#800020] text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10"
        >
          <Send className="size-4" /> Chat
        </Button>
        <Button size="sm">
          <StoreIcon className="size-4" /> Go to store
        </Button>
      </div>
    </div>
  );
};

export default VendorData;
