"use client";

import React, { useState } from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaUserPlus, FaComments, FaCheckCircle } from "react-icons/fa";
import {
  IconBuildingStore,
  IconClock,
  IconMessage,
  IconStar,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNowStrict } from "date-fns";
import { VendorWithProducts } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import useCountdown from "@/hooks/use-countdown";
import ProductCard from "@/components/globals/product-card";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { CheckCircle, Loader2 } from "lucide-react";
import useCoupon from "@/hooks/use-coupon";
import { Coupon as PrismaCoupon } from "@prisma/client";
import { useContactSeller } from "@/hooks/use-contact-seller";
import Tabs, { IItem } from "./tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useVendorActiveStatus from '@/hooks/use-vendor-active-status';

// Define a new type for the chat performance data
type ChatPerformanceData = {
  chatPerformance: string;
  performancePercentage: number;
};

const Client = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<IItem["value"]>("Products");
  const searchParams = useSearchParams();
  const { open } = useContactSeller();

  const vendorId = searchParams.get("id");
  const { statusText, isOnline } = useVendorActiveStatus(vendorId);
  const [vendor, setVendor] = React.useState<VendorWithProducts | null>(null);
  const [chatPerformance, setChatPerformance] =
    React.useState<ChatPerformanceData | null>(null);
  const [isLoadingVendor, setIsLoadingVendor] = React.useState(true);
  const [isLoadingChatPerformance, setIsLoadingChatPerformance] =
    React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);

  // New state variables for following functionality
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followersCount, setFollowersCount] = React.useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = React.useState(false);

  // Zustand state for coupons
  const { collectCoupon, isCouponCollected } = useCoupon();
  const [isCollecting, setIsCollecting] = React.useState(false);

  React.useEffect(() => {
    if (!vendorId) {
      setIsLoadingVendor(false);
      setIsLoadingChatPerformance(false);
      return;
    }

    // Function to fetch the main vendor data
    const fetchVendorData = async () => {
      try {
        const response = await fetch(`/api/v1/vendor/${vendorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data.");
        }
        const result = await response.json();
        if (result.success) {
          // Set the initial state for isFollowing and followersCount
          setVendor(result.data);
          setIsFollowing(result.data.isFollowedByUser);
          setFollowersCount(result.data.followersCount);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error fetching vendor:", err);
      } finally {
        setIsLoadingVendor(false);
      }
    };

    // Function to fetch the chat performance data
    const fetchChatPerformanceData = async () => {
      try {
        const response = await fetch(
          `/api/v1/vendor/${vendorId}/chat-performance`
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

    fetchVendorData();
    fetchChatPerformanceData();
  }, [vendorId]);

  // Handle follow/unfollow logic
  const handleFollowToggle = async () => {
    if (!vendorId) return;

    try {
      setIsLoadingFollow(true);
      let response;
      if (isFollowing) {
        // Unfollow
        response = await fetch(`/api/v1/vendor/${vendorId}/follow-store`, {
          method: "DELETE",
        });
      } else {
        // Follow
        response = await fetch(`/api/v1/vendor/${vendorId}/follow-store`, {
          method: "POST",
        });
      }

      const result = await response.json();
      if (result.success) {
        setIsFollowing(!isFollowing);
        // Optimistically update the followers count
        setFollowersCount((prevCount) =>
          isFollowing ? prevCount - 1 : prevCount + 1
        );

        if (!isFollowing) {
          setModalOpen(true);
        }
      } else {
        console.error("Failed to update follow status:", result.message);
      }

      router.refresh();
    } catch (err) {
      console.error("Error toggling follow status:", err);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  // Handle collecting a coupon
  const handleCollectCoupon = (coupon: PrismaCoupon) => {
    if (!vendor) return;

    setIsCollecting(true);
    // Add vendor details to the coupon object before storing it
    const couponWithVendorInfo = {
      ...coupon,
      vendorName: vendor.name ?? undefined,
      vendorImage: vendor.image ?? undefined,
    };
    collectCoupon(couponWithVendorInfo);
    setIsCollecting(false);
  };

  const CountdownComponent = ({ endDate }: { endDate: Date }) => {
    const countdown = useCountdown(endDate);

    if (!countdown) {
      return null; // Or a loading state
    }

    // Check if countdown is finished
    const isExpired =
      countdown.days +
        countdown.hours +
        countdown.minutes +
        countdown.seconds <=
      0;

    return (
      <p className="text-red-700 text-xs mt-1 font-medium whitespace-nowrap">
        {isExpired
          ? "Expired"
          : `Expires in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
      </p>
    );
  };

  const ProgressComponent = ({
    claimed,
    total,
  }: {
    claimed: number;
    total: number;
  }) => {
    const progressValue = (claimed / total) * 100;
    const progressText = `${Math.round(progressValue)}% claimed`;

    return (
      <div className="flex items-center w-full gap-2">
        <Progress className="h-[5px]" value={progressValue} />
        <p className="text-red-700 text-xs font-medium whitespace-nowrap">
          {progressText}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Products":
        return (
          <div className="px-60 pt-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Vouchers</h3>
              {isLoadingVendor ? (
                <div className="mt-5 grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-60 rounded-lg" />
                  ))}
                </div>
              ) : vendor?.coupon && vendor?.coupon.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full mt-5"
                >
                  <CarouselContent>
                    {vendor.coupon.map((coupon, index) => {
                      const claimedQuantity = coupon.claimedQuantity || 0;
                      const totalQuantity = coupon.claimableQuantity;
                      const isCouponClaimed = isCouponCollected(coupon.id);
                      const isExpired = new Date(coupon.endDate) < new Date();
                      const isOutOfStock = claimedQuantity >= totalQuantity;
                      return (
                        <CarouselItem
                          key={index}
                          className="lg:basis-1/3 basis-full"
                        >
                          <div className="relative h-36 border-[#800020]/30 pl-3 border rounded-lg bg-[#800020]/5 w-full">
                            <span className="text-[10px] absolute top-0 left-0 font-medium bg-[#800020] text-white px-2 py-1 rounded-br-lg rounded-tl-lg">
                              Limited Redemption
                            </span>
                            <div className="bg-white rounded-full w-[14px] h-[8px] absolute border border-[#800020]/30 -top-1 left-36"></div>
                            <div className="bg-white rounded-full w-[14px] h-[8px] absolute border border-[#800020]/30 -bottom-1 left-36"></div>
                            <div className="flex items-center h-full">
                              <div className="border-r-[2px] border-dashed border-[#800020]/20 pr-5 py-11 h-full">
                                {coupon.type === "Money off (min.spend)" ? (
                                  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
                                    <span className="text-xl">₱</span>
                                    {coupon.discountAmount?.toLocaleString()}
                                  </h3>
                                ) : (
                                  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
                                    {coupon.discountAmount}
                                    <span className="text-xl">% OFF</span>
                                  </h3>
                                )}
                                {coupon.minimumSpend && (
                                  <p className="text-sm whitespace-nowrap text-center text-red-700 mt-1 font-medium">
                                    Min. spend ₱
                                    {coupon.minimumSpend.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="pl-5 w-full pr-5">
                                <div className="flex w-full items-center justify-between">
                                  <p className="text-2xl font-bold tracking-tight text-[#800020]">
                                    {coupon.name}
                                  </p>
                                  <p className="text-xs text-red-600 px-1.5 py-1 rounded-lg bg-[#800020]/15 font-medium">
                                    T&C
                                  </p>
                                </div>
                                <p className="text-red-700 text-sm">
                                  {vendor.name}
                                </p>
                                <div className="flex items-start justify-between mt-2">
                                  <div>
                                    <ProgressComponent
                                      claimed={claimedQuantity}
                                      total={totalQuantity}
                                    />
                                    <CountdownComponent
                                      endDate={coupon.endDate}
                                    />
                                  </div>
                                  {/* TODO: Implement the global state local storage for claimed vouchers */}
                                  <Button
                                    className="flex items-center justify-end"
                                    size="sm"
                                    disabled={
                                      isExpired ||
                                      isOutOfStock ||
                                      isCouponClaimed ||
                                      isCouponCollected(coupon.id) ||
                                      isCollecting
                                    }
                                    onClick={() => handleCollectCoupon(coupon)}
                                  >
                                    {isCollecting ? (
                                      <Loader2 className="animate-spin" />
                                    ) : isCouponCollected(coupon.id) ? (
                                      "Collected"
                                    ) : isExpired ? (
                                      "Expired"
                                    ) : isOutOfStock ? (
                                      "Out of Stock"
                                    ) : (
                                      "Collect"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <p className="mt-5 text-gray-500">No vouchers available</p>
              )}
            </div>
            <h3 className="text-xl mt-10 font-bold tracking-tight">
              Recommended for you
            </h3>
            <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
              {isLoadingVendor ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-60 rounded-lg" />
                ))
              ) : vendor?.product && vendor?.product.length > 0 ? (
                vendor.product.map((product) => {
                  const price =
                    product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => v.price))
                      : product.price || 0;

                  const discounts = getDiscountInfo(product);
                  const hasDiscount = discounts.length > 0;
                  const discountPrice = calculateDiscountPrice(
                    price,
                    discounts
                  );
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      price={price}
                      discounts={discounts}
                      hasDiscount={hasDiscount}
                      viewMode={"grid4"}
                      discountPrice={discountPrice}
                      categories={product.categorySlug || ""}
                      subcategories={product.subCategorySlug || ""}
                    />
                  );
                })
              ) : (
                <div className="text-center col-span-full py-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Image
                      src="/images/empty-products.svg"
                      alt="No products found"
                      width={200}
                      height={200}
                    />
                    <h3 className="text-xl font-medium text-gray-700">
                      No products available
                    </h3>
                    <p className="text-gray-500">
                      It seems like this vendor has no products listed at the
                      moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "Policies":
        return (
          <div className="px-60 pt-10">
            <h3 className="text-xl font-bold tracking-tight">Policies</h3>
            {vendor?.vendorPolicies && vendor.vendorPolicies.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {vendor.vendorPolicies.map((policy) => (
                  <AccordionItem key={policy.id} value={policy.id}>
                    <AccordionTrigger className="font-semibold text-lg">
                      {policy.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <div className='space-y-4' dangerouslySetInnerHTML={{__html: policy.content || ""}} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/images/empty-products.svg"
                    alt="No policies found"
                    width={200}
                    height={200}
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No policies available
                  </h3>
                  <p className="text-gray-500">
                    It seems like this vendor has not provided any policies yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "FAQs":
        return (
          <div className="px-60 pt-10">
            <h3 className="text-xl font-bold tracking-tight">
              Frequently Asked Questions
            </h3>
            {vendor?.vendorFaqs && vendor.vendorFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {vendor.vendorFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="font-semibold text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <div className='space-y-4' dangerouslySetInnerHTML={{__html: faq.answer || ""}} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/images/empty-products.svg"
                    alt="No FAQs found"
                    width={200}
                    height={200}
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No FAQs available
                  </h3>
                  <p className="text-gray-500">
                    It seems like this vendor has not provided any FAQs yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "Reviews":
        return (
          <div className="px-60 pt-10">
            <h3 className="text-xl font-bold tracking-tight">Reviews</h3>
          </div>
        );
    }
  };

  return (
    <>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col">
          <div className="flex items-center justify-center mb-2 gap-2">
            <CheckCircle fill="#32cd32" color="#fff" />
            <p className="font-medium">Followed successfully</p>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-3">
            View followed stores at {"'Account' > 'Followed Stores'"}
          </p>
          <div className="relative w-full h-[450px]">
            <Image
              fill
              src="/followed-store.png"
              alt="Followed store"
              className="w-full h-full"
            />
          </div>
          <Button
            type="button"
            onClick={() => setModalOpen(false)}
            className="mt-5 w-full"
          >
            Okay
          </Button>
        </div>
      </Modal>
      <div className="min-h-screen bg-[#fff]">
        <div className="relative">
          <Header />
          <section className="pt-40">
            <div className="grid px-60 mb-5 lg:grid-cols-13 grid-cols-1 gap-5">
              <div className="lg:col-span-5">
                <div className="flex flex-col items-start bg-gradient-to-r from-[#800020] to-[#a01530] rounded-md p-4 ring-2 ring-white/10 shadow-lg">
                  {isLoadingVendor ? (
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div
                        className={`relative ${vendor?.isPremium ? "size-22" : "size-20"} rounded-full overflow-hidden border-2 border-green-200`}
                      >
                        <Image
                          src={vendor?.image || ""}
                          alt={vendor?.name || "Vendor Image"}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        {vendor?.isPremium && (
                          <div className="bg-gradient-to-r mb-1 flex items-center gap-1 w-[80%] from-white/40 text-white to-transparent font-bold text-[10px] px-1.5 py-0.5 rounded-xs">
                            Verified{" "}
                            <span className="bg-blue-600 text-[8px] rounded-xs text-white px-1 py-[1px]">
                              PRO
                            </span>
                          </div>
                        )}
                        <h2 className="text-white text-lg font-semibold">
                          {vendor?.name || "Vendor Name"}
                        </h2>

                        <div className="flex items-center gap-1 mt-1">
                          {isOnline && (
                            <div
                              className={`bg-green-500 rounded-full size-2`}
                            />
                          )}
                          <p className="text-xs text-gray-300">
                            {statusText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center w-full space-x-2 mt-4">
                    {isLoadingVendor ? (
                      <>
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={handleFollowToggle}
                          disabled={isLoadingFollow}
                          className={`flex cursor-pointer flex-1 justify-center rounded-none items-center space-x-1 px-3 py-1 text-sm transition-colors border
                            ${
                              isFollowing
                                ? "bg-white text-black hover:bg-gray-200 border-white"
                                : "bg-transparent text-white hover:bg-white hover:text-black border-white"
                            }
                          `}
                        >
                          {isLoadingFollow ? (
                            <Loader2 className="animate-spin text-sm" />
                          ) : isFollowing ? (
                            <FaCheckCircle className="text-sm" />
                          ) : (
                            <FaUserPlus className="text-sm" />
                          )}
                          <span>
                            {isLoadingFollow
                              ? "Loading..."
                              : isFollowing
                                ? "Following"
                                : "Follow"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => open(vendorId as string)}
                          className="flex cursor-pointer flex-1 rounded-none justify-center items-center space-x-1 text-white hover:text-black px-3 py-1 bg-transparent border border-white text-sm hover:bg-accent transition-colors"
                        >
                          <FaComments className="text-xs" />
                          <span>Chat</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 ml-10 space-y-8">
                {isLoadingVendor ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <IconBuildingStore className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">Products:</p>
                        <p className="font-medium text-base text-[#800020]">
                          {vendor?.product.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <IconUsers className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">Followers:</p>
                        <p className="font-medium text-base text-[#800020]">
                          {followersCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconMessage className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">
                          Chat Performance:
                        </p>
                        {isLoadingChatPerformance ? (
                          <Skeleton className="h-4 w-[120px]" />
                        ) : (
                          <p className="font-medium text-base text-[#800020]">
                            {chatPerformance?.chatPerformance ||
                              "N/A (No data)"}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="lg:col-span-4 ml-10 space-y-8">
                {isLoadingVendor ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <IconWallet className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">Sold:</p>
                        <p className="font-medium text-base text-[#800020]">
                          {vendor?.orderItem?.length || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconStar className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">Rating:</p>
                        <p className="font-medium text-base text-[#800020]">
                          4.9 (216 Rating)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <IconClock className="text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <p className="text-base text-gray-500">Joined:</p>
                        <p className="font-medium text-base text-[#800020]">
                          {formatDistanceToNowStrict(
                            vendor?.createdAt ?? new Date()
                          )}{" "}
                          ago
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="bg-[#f5f5f5] pb-20">{renderContent()}</div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Client;
