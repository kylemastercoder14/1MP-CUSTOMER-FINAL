/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import { Category, SubCategory } from "@prisma/client";
import { ProductWithProps } from "@/types";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  IoArrowRedoCircleSharp,
  IoBonfireSharp,
  IoFlashSharp,
  IoTimeSharp,
} from "react-icons/io5";
import {
  calculateDiscountPrice,
  formatTime,
  getDiscountInfo,
} from "@/lib/utils";
import ProductCard from "@/components/globals/product-card";
import FlashDealsSkeletonCarousel, {
  SkeletonCard,
} from "@/components/globals/flash-deal-skeleton";

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [flashDealsLoading, setFlashDealsLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithProps[]>([]);
  const [flashDeals, setFlashDeals] = useState<ProductWithProps[]>([]);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [flashDealEndTime, setFlashDealEndTime] = useState<Date | null>(null);

  // Category Skeleton Component
  const CategorySkeleton = () => (
    <div className="flex space-x-4 mb-10 border-b">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-gray-200 rounded-t w-32 animate-pulse"
        ></div>
      ))}
    </div>
  );

  // No Products Found Component
  const NoProductsFound = ({
    title = "No products found",
    description = "Try selecting a different category",
  }) => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image
          src="/images/empty-products.svg"
          alt="No products found"
          width={200}
          height={200}
        />
        <h3 className="text-xl font-medium text-gray-700">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );

  // Find the earliest end time among all flash deals
  useEffect(() => {
    if (flashDeals.length > 0) {
      const endTimes = flashDeals
        .filter((product) => product.productDiscount?.endDate)
        .map((product) => new Date(product.productDiscount!.endDate).getTime());

      if (endTimes.length > 0) {
        const earliestEndTime = new Date(Math.min(...endTimes));
        setFlashDealEndTime(earliestEndTime);
      }
    }
  }, [flashDeals]);

  // Countdown timer function
  const updateCountdown = useCallback(() => {
    if (!flashDealEndTime) return;

    const now = new Date();
    const diff = flashDealEndTime.getTime() - now.getTime();

    if (diff <= 0) {
      // Flash deal has ended
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Calculate time remaining
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  }, [flashDealEndTime]);

  // Set up the countdown interval
  useEffect(() => {
    updateCountdown(); // Initial call
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [updateCountdown]);

  // Fetch flash deals products
  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setFlashDealsLoading(true);
        const response = await fetch("/api/v1/flash-deals-products");
        const data = await response.json();
        setFlashDeals(data);
      } catch (error) {
        console.error("Error fetching flash deals:", error);
        setFlashDeals([]);
      } finally {
        setFlashDealsLoading(false);
      }
    };
    fetchFlashDeals();
  }, []);

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/v1/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when selected category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) {
        setSubCategories([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/sub-categories/${selectedCategory.slug}`
        );
        const data = await response.json();
        if (data.success) {
          setSubCategories(data.data);
          setSelectedSubCategory(null);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  // Fetch products when filters or selections change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/v1/top-deals-products`;

        // Add category filter if selected (not "All")
        if (selectedCategory) {
          url += `?category=${selectedCategory.slug}`;

          // Add subcategory filter if selected
          if (selectedSubCategory) {
            url += `&subCategory=${selectedSubCategory.slug}`;
          }
        } else if (selectedSubCategory) {
          // Handle case where subcategory is selected without category
          url += `?subCategory=${selectedSubCategory.slug}`;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory]);

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Header />
        <div className="w-full h-[29vh] bg-gradient-to-br from-[#800020] via-[#a91b3e] to-[#8b1538] relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-10 w-20 h-20 bg-[#a91b3e] rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute top-16 right-20 w-12 h-12 bg-[#8b1538] rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-8 left-1/3 w-16 h-16 bg-[#a91b3e] rounded-full opacity-15 animate-pulse"></div>
            <div className="absolute bottom-12 right-1/4 w-8 h-8 bg-[#8b1538] rounded-full opacity-25 animate-bounce"></div>
          </div>

          {/* Lightning bolt pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M50 20 L80 80 L60 80 L90 160 L70 100 L85 100 L50 20 Z"
                fill="currentColor"
                className="text-[#a91b3e]"
              />
              <path
                d="M320 30 L350 90 L330 90 L360 170 L340 110 L355 110 L320 30 Z"
                fill="currentColor"
                className="text-[#8b1538]"
              />
            </svg>
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-20 mt-28 w-full">
              <div className="flex items-center justify-between">
                {/* Left side - Title and description */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-lg animate-pulse">
                      <IoFlashSharp className="text-[#800020] text-2xl" />
                    </div>
                    <h2 className="text-4xl text-white font-bold tracking-tight">
                      Flash Deals
                    </h2>
                    <div className="flex items-center gap-1 bg-[#4a4a4a] px-3 py-1 rounded-full animate-bounce">
                      <IoBonfireSharp className="text-white text-sm" />
                      <span className="text-white text-sm font-bold">HOT</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <IoArrowRedoCircleSharp className="text-white text-xl" />
                    <p className="text-lg font-medium text-white">
                      Score the lowest prices on 1 Market Philippines
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-sm font-medium">
                      Limited time offers
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-sm font-medium">
                      Up to 40% off on selected products
                    </span>
                  </div>
                </div>

                {/* Right side - Countdown timer */}
                <div className="flex-shrink-0 ml-8">
                  <div className="text-center">
                    <div className="flex items-center gap-1 mb-2">
                      <IoTimeSharp className="text-white text-lg" />
                      <span className="text-gray-200 text-sm font-semibold">
                        ENDS IN
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] border border-red-400">
                        <div className="text-red-300 text-2xl font-bold font-mono">
                          {formatTime(timeRemaining.days)}
                        </div>
                        <div className="text-red-200 text-xs font-medium">
                          DAYS
                        </div>
                      </div>
                      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] border border-red-400">
                        <div className="text-red-300 text-2xl font-bold font-mono">
                          {formatTime(timeRemaining.hours)}
                        </div>
                        <div className="text-red-200 text-xs font-medium">
                          HRS
                        </div>
                      </div>

                      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] border border-red-400">
                        <div className="text-red-300 text-2xl font-bold font-mono">
                          {formatTime(timeRemaining.minutes)}
                        </div>
                        <div className="text-red-200 text-xs font-medium">
                          MIN
                        </div>
                      </div>

                      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] border border-red-400">
                        <div className="text-red-300 text-2xl font-bold font-mono animate-pulse">
                          {formatTime(timeRemaining.seconds)}
                        </div>
                        <div className="text-red-200 text-xs font-medium">
                          SEC
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>
        </div>

        <section className="px-20 mx-auto py-10">
          {/* Flash Deals Products */}
          {flashDealsLoading ? (
            <FlashDealsSkeletonCarousel />
          ) : flashDeals.length > 0 ? (
            <Carousel className="w-full max-w-full mb-12">
              <CarouselContent className="-ml-1">
                {flashDeals.map((product) => {
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
                      className="pl-1 md:basis-1/2 lg:basis-1/5"
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
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="mb-12">
              <NoProductsFound
                title="No flash deals available"
                description="Check back later for exciting flash deals!"
              />
            </div>
          )}

          {categoriesLoading ? (
            <CategorySkeleton />
          ) : (
            <>
              {/* Category Carousel (Tabs) */}
              <div className="mb-10">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full border-b"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    <CarouselItem className="pl-2 md:pl-4 basis-auto">
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={`pt-2 pb-4 px-4 text-base font-medium whitespace-nowrap transition-colors border-b-[3px]
						${
              !selectedCategory
                ? "text-gray-900 border-[#800020]"
                : "text-gray-600 border-transparent"
            }`}
                      >
                        All
                      </button>
                    </CarouselItem>
                    {categories.map((category) => (
                      <CarouselItem
                        key={category.id}
                        className="pl-2 md:pl-4 basis-auto"
                      >
                        <button
                          onClick={() => handleCategoryChange(category)}
                          className={`pt-2 pb-4 px-4 text-base font-medium whitespace-nowrap transition-colors border-b-[3px]
							${
                selectedCategory?.id === category.id
                  ? "text-gray-900 border-[#800020]"
                  : "text-gray-600 border-transparent"
              }`}
                        >
                          {category.name}
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>

              {/* Products Display Section */}
              <div className="space-y-2">
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <NoProductsFound />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => {
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
                          categories={selectedCategory?.slug || ""}
                          subcategories={selectedSubCategory?.slug || ""}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
