/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { categoryBanner } from "@/data/category-banner";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryWithSubCategories } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNowStrict } from "date-fns";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import ProductCard from "@/components/globals/product-card";

const Client = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get("name") || "all";

  const [category, setCategory] =
    React.useState<CategoryWithSubCategories | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // If the slug is the default, you might not want to fetch anything
    // or fetch a special "all categories" category.
    if (categorySlug === "all") {
      setIsLoading(false);
      // You could set a default "all categories" state here
      return;
    }

    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/v1/categories/slug?name=${categorySlug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch category data.");
        }
        const result = await response.json();
        // The API returns an object with a 'data' key
        if (result.success) {
          setCategory(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative lg:pb-20 pb-10">
        <Header />
        <div className="w-full h-[350px] relative">
          {/* Background Image */}
          <Image
            src={
              categoryBanner(categorySlug) ||
              "https://via.placeholder.com/1500x188"
            }
            alt={category?.name || "Category Banner"}
            fill
            className="size-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Content - Aligned to center */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="lg:px-20 px-10 lg:mt-24 mt-10 text-white">
              <div>
                {isLoading ? (
                  <h1 className="text-2xl md:text-5xl font-bold mb-4">
                    <Loader2 className="animate-spin inline-block" />
                  </h1>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
                      {category?.name || "Category"}
                    </h1>
                    <p className="text-lg text-center mb-8">
                      Discover new and trending products
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md shadow-md -mt-18 relative p-5 max-w-7xl lg:mx-auto mx-9">
          <h2 className="text-2xl font-bold tracking-tight">
            Source by category
          </h2>
          <div className="mt-5">
            {isLoading ? (
              <div className="grid lg:grid-cols-7 grid-cols-1 gap-5">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Skeleton className="w-20 h-20 rounded-full mb-2" />
                    <Skeleton className="w-24 h-4 rounded" />
                  </div>
                ))}
              </div>
            ) : category?.subCategories && category.subCategories.length > 0 ? (
              <Carousel className="w-full">
                <div className="flex items-center">
                  <CarouselContent className="flex-1">
                    {category?.subCategories.map((subCategory) => {
                      return (
                        <CarouselItem
                          key={subCategory.id}
                          className="lg:basis-1/9 basis-1/4"
                        >
                          <div
                            key={subCategory.id}
                            onClick={() =>
                              router.push(
                                `/category/sub-category?name=${subCategory.slug}`
                              )
                            }
                            className="flex cursor-pointer flex-col items-center justify-center group"
                          >
                            <div className="lg:size-20 size-16 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center group-hover:scale-110">
                              <Image
                                src={subCategory.image || ""}
                                alt={subCategory.name}
                                fill
                                className="object-cover size-full rounded-full"
                              />
                            </div>
                            <span className="text-xs group-hover:font-semibold mt-2 text-center text-gray-700 leading-tight">
                              {subCategory.name}
                            </span>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </div>
                <CarouselPrevious className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
                <CarouselNext className="transform-none items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
              </Carousel>
            ) : (
              <p className="text-center text-gray-500">
                No subcategories available for this category.
              </p>
            )}
          </div>
        </div>
        <section className="max-w-7xl lg:mx-auto mx-14">
          <div className="mt-10">
            <h3 className="text-2xl -mx-5 lg:-mx-0 font-bold tracking-tight">
              Verified Pro Seller
            </h3>
            {isLoading ? (
              <div className="mt-5 grid lg:grid-cols-3 grid-cols-1 gap-4 lg:gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-60 rounded-lg" />
                ))}
              </div>
            ) : category?.vendor && category.vendor.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full mt-5"
              >
                <CarouselContent>
                  {category.vendor.map((vendor) => (
                    <CarouselItem
                      key={vendor.id}
                      className="lg:basis-1/3 basis-full"
                    >
                      <div
                        className="relative cursor-pointer overflow-hidden rounded-lg bg-cover bg-center h-60"
                        style={{
                          backgroundImage:
                            "url('https://images.pexels.com/photos/5700036/pexels-photo-5700036.jpeg')",
                        }}
                        onClick={() => router.push(`/vendor?id=${vendor.id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                        <div className="relative p-6 h-full flex flex-col justify-end text-white">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-gradient-to-r flex items-center gap-1 w-[80%] from-[#800020] to-transparent font-bold text-sm px-2 py-2 rounded-md">
                              Verified{" "}
                              <span className="bg-white text-[8px] rounded-xs text-black px-1 py-[1px]">
                                PRO
                              </span>
                              <span className="text-xs ml-1">|</span>
                              <img
                                src={vendor.image || ""}
                                alt={vendor.name || ""}
                                className="rounded-full w-5 h-5 ml-1"
                              />
                            </div>
                          </div>
                          <p className="text-xl font-semibold">
                            {vendor.name || "Vendor Name"}
                          </p>
                          <p className="mb-3 text-xs">
                            Over {formatDistanceToNowStrict(vendor.createdAt)}{" "}
                            of experience in the{" "}
                            <span className="lowercase">{category.name}</span>{" "}
                            industry
                          </p>
                          <div className="flex space-x-2">
                            {vendor.product &&
                              vendor.product.slice(0, 2).map((product) => (
                                <div key={product.id}>
                                  <div className="w-20 h-20 rounded-md overflow-hidden">
                                    <img
                                      src={product.images[0] || ""}
                                      alt={product.name || "Product Image"}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <p className="text-center text-gray-500 mt-5">
                No verified vendors available for this category.
              </p>
            )}
          </div>
          <div className="mt-14 lg:-mx-0 -mx-8">
            {isLoading ? (
              <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-72 rounded-lg" />
                ))}
              </div>
            ) : // Check for product data before mapping
            category?.product && category.product.length > 0 ? (
              <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
                {category.product.map((product) => {
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
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No products available in this category.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
