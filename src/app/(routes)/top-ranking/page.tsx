/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import Footer from "@/components/globals/footer";
import { Category, SubCategory } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductWithProps } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "../../../components/globals/product-card";
import { calculateDiscountPrice, getDiscountInfo } from "../../../lib/utils";
import { IoRibbonSharp } from 'react-icons/io5';

// Helper interface for grouped products
interface GroupedSubCategory {
  subCategory: SubCategory;
  products: ProductWithProps[];
}

const Page = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState("soldCount");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithProps[]>([]);

  const filters = [
    { value: "soldCount", label: "Best Sellers" },
    { value: "popularityScore", label: "Most Popular" },
    { value: "bestReviewed", label: "Best Reviewed" },
  ];

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/v1/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          // Note: We intentionally do NOT auto-select the first category here
          // if we want "All" to be the default state showing grouped products from all categories.
          // If the user selects "All" (by default, selectedCategory = null), the grouping logic below will apply to all fetched products.
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
      // Subcategories are only relevant if a main category is selected
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
          setSelectedSubCategory(null); // Reset subcategory selection
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
      setLoading(true);
      try {
        let url = `/api/v1/top-ranking-products?sortBy=${activeFilter}`;

        // If 'All' is selected for categories, we don't add the category param,
        // and the API fetches products across all categories.
        if (selectedCategory) {
          url += `&category=${selectedCategory.slug}`;
        }

        if (selectedSubCategory) {
          // If a specific subcategory is selected, we filter by it.
          url += `&subCategory=${selectedSubCategory.slug}`;
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
  }, [selectedCategory, selectedSubCategory, activeFilter]);

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Reset subcategory filter when category changes
  };

  const groupedProducts = useMemo<GroupedSubCategory[] | null>(() => {
    // Only group if no specific subcategory filter is applied.
    // This allows grouping by subcategory when "All" category is selected or when a specific category is selected without a subcategory filter.
    if (selectedSubCategory) {
      return null;
    }

    const groupedMap: { [key: string]: ProductWithProps[] } = {};

    // Iterate through products (which are already sorted by the active filter, e.g., 'Best Sellers')
    products.forEach((product) => {
      // Ensure the product has a subCategorySlug and the subCategory object is present
      const subCategorySlug = product.subCategorySlug;
      if (subCategorySlug && product.subCategory) {
        // Initialize the group if it doesn't exist
        if (!groupedMap[subCategorySlug]) {
          groupedMap[subCategorySlug] = [];
        }

        // Add the product only if the group has less than 3 items
        // Since products are sorted, the first 3 added are the top 3 for this subcategory.
        if (groupedMap[subCategorySlug].length < 3) {
          groupedMap[subCategorySlug].push(product);
        }
      }
    });

    // Convert the map to an array of SubCategorySection data
    const result: GroupedSubCategory[] = Object.keys(groupedMap)
      .map((slug) => {
        // We ensure we have products in the group and the subCategory object is present
        const subCategory = groupedMap[slug][0]?.subCategory as SubCategory;
        return {
          subCategory,
          products: groupedMap[slug],
        };
      })
      .filter((group) => group.subCategory); // Filter out any groups where subCategory might be undefined

    return result;
  }, [products, selectedSubCategory]);

  // Section component for grouping by subcategory
  const SubCategorySection = ({
    subCategory,
    products,
  }: {
    subCategory: SubCategory;
    products: ProductWithProps[];
  }) => {
    if (products.length === 0) {
      return null;
    }

    return (
      <div className='mb-10'>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {subCategory.name}
        </h2>
        {/* Products are displayed side-by-side in a 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const price =
              product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : product.price || 0;

            const discounts = getDiscountInfo(product);
            const hasDiscount = discounts.length > 0;
            const discountPrice = calculateDiscountPrice(price, discounts);
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
                rank={index + 1}
              />
            );
          })}
        </div>
      </div>
    );
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
        <div className="w-full h-[35vh] relative overflow-hidden flex items-center justify-center">
          {/* Background Image */}
          <Image
            src="/images/top-banner.webp"
            alt="Top ranking products background"
            fill
            className="size-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-500 ease-in-out" // Added subtle zoom on hover (optional)
            priority
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Animated Gradient Overlay (Subtle Effect) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gray-900 opacity-20 animate-pulse-slow"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center mt-30 px-4">
            {" "}
            {/* Adjusted mt for header space */}
            <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
              <IoRibbonSharp className="text-yellow-400 text-3xl sm:text-4xl animate-bounce-slow" />{" "}
              {/* Ranking icon */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter drop-shadow-lg">
                Top Ranking Products
              </h2>
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-medium max-w-2xl opacity-90 animate-fade-in-up delay-200">
              Discover our best-selling and highest-rated items, loved by
              customers like you!
            </p>
          </div>

          {/* Tailwind CSS keyframes for animation (add to your global CSS or equivalent) */}
          <style jsx>{`
            @keyframes pulse-slow {
              0%,
              100% {
                opacity: 0.2;
              }
              50% {
                opacity: 0.3;
              }
            }
            @keyframes fade-in-up {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes bounce-slow {
              0%,
              100% {
                transform: translateY(0);
              }
              25% {
                transform: translateY(-5px);
              }
              50% {
                transform: translateY(0);
              }
              75% {
                transform: translateY(-3px);
              }
            }
            .animate-pulse-slow {
              animation: pulse-slow 6s infinite ease-in-out;
            }
            .animate-fade-in-up {
              animation: fade-in-up 1s ease-out forwards;
            }
            .animate-fade-in-up.delay-200 {
              animation-delay: 0.2s;
            }
            .animate-bounce-slow {
              animation: bounce-slow 3s infinite ease-in-out;
            }
          `}</style>
        </div>

        <section className="py-16 px-20">
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

              {/* Product Filters (Hot selling, Most popular, Best reviewed) */}
              <div className="flex flex-wrap gap-2 mb-8">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter.value
                        ? "border-2 border-gray-700 text-black"
                        : "border text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
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
                ) : groupedProducts ? (
                  // Display grouped products by subcategory
                  groupedProducts.map((group) => (
                    <div
                      className="grid lg:grid-cols-2 grid-cols-1 gap-5"
                      key={group.subCategory.slug}
                    >
                      <SubCategorySection
                        subCategory={group.subCategory}
                        products={group.products}
                      />
                    </div>
                  ))
                ) : (
                  // Display a standard grid if a specific subcategory is selected
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => {
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
                          categories={product?.categorySlug || ""}
                          subcategories={product?.subCategorySlug || ""}
                          rank={index ? index + 1 : undefined}
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
