/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import {
  IoArrowForwardCircleSharp,
  IoGiftSharp,
  IoLeafSharp,
  IoSparklesSharp,
} from "react-icons/io5";
import {
  calculateDiscountPrice,
  getDiscountInfo,
  getTimeSinceListing,
} from "@/lib/utils";
import ProductCard from "@/components/globals/product-card";

const Page = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithProps[]>([]);

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
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  // Fetch products when filters or selections change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `/api/v1/new-arrivals-products`;

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

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
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

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Header />
        <div className="w-full h-[29vh] bg-gradient-to-br from-[#0a6b4a] via-[#108c68] to-[#12a176] relative overflow-hidden">
          {/* Animated background elements (adapted to green colors) */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-10 w-20 h-20 bg-[#108c68] rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute top-16 right-20 w-12 h-12 bg-[#12a176] rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-8 left-1/3 w-16 h-16 bg-[#108c68] rounded-full opacity-15 animate-pulse"></div>
            <div className="absolute bottom-12 right-1/4 w-8 h-8 bg-[#12a176] rounded-full opacity-25 animate-bounce"></div>
          </div>

          {/* Product icon pattern (adapted to a leaf or gift theme) */}
          <div className="absolute inset-0 opacity-10 flex justify-around items-center">
            {/* You can replace this with a leaf or subtle product icon pattern if desired */}
            <IoLeafSharp className="text-white text-9xl opacity-30 animate-spin-slow" />
            <IoGiftSharp className="text-white text-8xl opacity-30 animate-pulse-slow" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="container mt-28 mx-auto px-14 w-full">
              <div className="flex items-center justify-between">
                {/* Left side - Title and description */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Icon for New Arrivals */}
                    <div className="p-2 bg-white rounded-lg shadow-lg animate-pulse">
                      <IoSparklesSharp className="text-[#0a6b4a] text-2xl" />
                    </div>
                    <h2 className="text-4xl text-white font-bold tracking-tight">
                      New Arrivals
                    </h2>
                    {/* 'Fresh' or 'New' indicator */}
                    <div className="flex items-center gap-1 bg-[#2e8b57] px-3 py-1 rounded-full animate-bounce">
                      <IoLeafSharp className="text-white text-sm" />
                      <span className="text-white text-sm font-bold">
                        FRESH
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <IoArrowForwardCircleSharp className="text-white text-xl" />
                    <p className="text-lg font-medium text-white">
                      Discover the latest products added to our collection.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-sm font-medium">
                      Exclusive items now available
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-sm font-medium">
                      Shop the newest trends
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shine effect (using lighter green for contrast) */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>
        </div>
        <section className="container mx-auto py-16 px-4 lg:px-10">
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
                      const newArrival = getTimeSinceListing(product);
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          price={price}
                          discounts={discounts}
                          hasDiscount={hasDiscount}
                          viewMode={"grid4"}
                          discountPrice={discountPrice}
                          categories={product?.categorySlug || ""}
                          subcategories={product?.subCategorySlug || ""}
                          newArrival={newArrival}
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
