"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FollowStore } from "@prisma/client";
import { VendorWithProducts } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import StoreCard from "@/components/globals/store-card";
import Image from "next/image";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductCard from "@/components/globals/product-card";

dayjs.extend(relativeTime);

interface FollowedStoreProps extends FollowStore {
  vendor: VendorWithProducts;
}

const Client = () => {
  const router = useRouter();
  const [followedStores, setFollowedStores] = React.useState<
    FollowedStoreProps[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchFollowedStores = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/customer/followed-stores");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        setFollowedStores(data);
      } catch (error) {
        console.error("Failed to fetch followed stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedStores();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Following</h2>
      {isLoading ? (
        // Loading state for the carousel
        <div className="flex space-x-4 mt-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-44 h-24 rounded-lg" />
          ))}
        </div>
      ) : followedStores && followedStores.length > 0 ? (
        <Carousel className="w-full max-w-full">
          <CarouselContent className="-ml-1">
            {followedStores.map((store) => (
              <StoreCard
                key={store.id}
                storeName={store.vendor?.name || "Store Name"}
                image={store.vendor?.image || ""}
                sold={store.vendor?.orderItem?.length || 0}
                href={`/vendor?id=${store.vendor?.id}`}
              />
            ))}
          </CarouselContent>
          <CarouselPrevious className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
          <CarouselNext className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
        </Carousel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full mt-30">
          <Image src="/no-data.svg" alt="No Data" width={150} height={150} />
          <h3 className="text-lg mt-4 font-medium">No followed stores found</h3>
          <p className="text-muted-foreground">
            You are not following any stores yet. Start exploring and follow
            your favorite stores to see their latest products!
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-10">Store updates</h2>

      {isLoading ? (
        // Your loading state remains the same
        <div className="mt-5 space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="mt-3 grid lg:grid-cols-4 grid-cols-1 gap-5">
                <Skeleton className="w-full h-72" />
              </div>
            </div>
          ))}
        </div>
      ) : followedStores && followedStores.length > 0 ? (
        // Map over followed stores to create a section for each store
        followedStores.map((store) => {
          // If the vendor has no approved products, skip this store
          if (!store.vendor.product || store.vendor.product.length === 0) {
            return null;
          }

          const sortedProducts = [...(store.vendor.product || [])].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return (
            <div key={store.id} className="mt-5">
              <div
                onClick={() => router.push(`/vendor?id=${store.vendorId}`)}
                className="flex cursor-pointer items-center gap-3"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={store.vendor?.image as string}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {store?.vendor?.name?.charAt(0) ?? "N"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>
                    {store.vendor?.name} has provided a{" "}
                    <b>
                      {sortedProducts.length > 1 ? "few new items" : "new item"}
                    </b>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {/* Use the timestamp of the very latest product */}
                    {dayjs(sortedProducts[0].createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <Carousel className="w-full max-w-full mt-5">
                <CarouselContent className="-ml-1">
                  {sortedProducts.map((product) => {
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
                      <CarouselItem
                        key={product.id}
                        className="pl-1 md:basis-1/2 lg:basis-1/4"
                      >
                        <ProductCard
                          product={product}
                          price={price}
                          discounts={discounts}
                          hasDiscount={hasDiscount}
                          viewMode={"grid4"}
                          discountPrice={discountPrice}
                          categories={product.categorySlug || ""}
                          subcategories={product.subCategorySlug || ""}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
                <CarouselNext className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
              </Carousel>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full mt-30">
          <p className="text-muted-foreground">
            Updates will appear here once you follow some stores.
          </p>
        </div>
      )}
    </div>
  );
};

export default Client;
