"use client";

import { CheckIcon, Mails, Send, Star, StoreIcon, Users } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { ProductWithProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactSeller } from '@/hooks/use-contact-seller';

type ChatPerformanceData = {
  chatPerformance: string;
  performancePercentage: number;
};

const VendorData = ({
  product,
  loading,
}: {
  product: ProductWithProps | null;
  loading: boolean;
}) => {
  const router = useRouter();
  const { open } = useContactSeller();
  const [isLoadingChatPerformance, setIsLoadingChatPerformance] =
    React.useState(true);
  const [chatPerformance, setChatPerformance] =
    React.useState<ChatPerformanceData | null>(null);

  React.useEffect(() => {
    if (!product?.vendorId) {
      setIsLoadingChatPerformance(false);
      return;
    }

    // Function to fetch the chat performance data
    const fetchChatPerformanceData = async () => {
      try {
        const response = await fetch(
          `/api/v1/vendor/${product.vendorId}/chat-performance`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat performance data.");
        }
        const result = await response.json();
        if (result.success) {
          setChatPerformance(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error fetching chat performance:", err);
      } finally {
        setIsLoadingChatPerformance(false);
      }
    };

    fetchChatPerformanceData();
  }, [product?.vendorId]);
  return (
    <div className="bg-white mt-3 rounded-md border px-3 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="relative size-10 rounded-full">
          <Image
            src={product?.vendor.image || ""}
            alt={product?.vendor.name || ""}
            fill
            className="size-full object-cover rounded-full"
          />
        </div>
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
            {/* TODO: Seller Rating */}
            <span className="bg-amber-200 mt-1 text-amber-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
              <Star className="inline size-3 mr-1 fill-current" />
              Seller Ratings: 96%
            </span>
            {loading && isLoadingChatPerformance ? (
              <Skeleton className="h-4 w-[120px]" />
            ) : (
              <span className="bg-blue-200 mt-1 text-blue-700 text-xs px-1.5 py-0.5 font-medium rounded-md">
                <Users className="inline size-3 mr-1" />
                Followers: {product?.vendor?.followStore?.length || 0}
              </span>
            )}
            {isLoadingChatPerformance ? (
              <Skeleton className="h-4 w-[120px]" />
            ) : (
              <span className="bg-[#644117]/20 mt-1 text-[#644117] text-xs px-1.5 py-0.5 font-medium rounded-md">
                <Mails className="inline size-3 mr-1" />
                Chat performance:{" "}
                {chatPerformance?.chatPerformance || "N/A (No data)"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-[#800020] text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10"
          onClick={() => open(product?.vendorId as string)}
        >
          <Send className="size-4" /> Chat
        </Button>
        <Button
          onClick={() => router.push(`/vendor?id=${product?.vendor.id}`)}
          size="sm"
        >
          <StoreIcon className="size-4" /> Go to store
        </Button>
      </div>
    </div>
  );
};

export default VendorData;
