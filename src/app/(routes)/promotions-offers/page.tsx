"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  calculateDiscountPrice,
  categoryNameToSlug,
  cn,
  getDiscountInfo,
  getTimeSinceListing,
} from "@/lib/utils";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { ProductWithProps } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FlashDealsSkeletonCarousel from "@/components/globals/flash-deal-skeleton";
import ProductCard from "@/components/globals/product-card";
import { useRouter } from 'next/navigation';

interface ProductsByCategory {
  [category: string]: ProductWithProps[];
}

const categories = [
  "Fashion & Apparel",
  "Jewelry & Accessories",
  "Arts, Crafts & Sewing",
];

// Skeleton loading card component
const SkeletonCard = () => (
  <div className="relative w-full h-24 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
  </div>
);

// Empty products message component
const EmptyProductsMessage = () => (
  <div className="col-span-2 text-center h-full flex flex-col mx-auto items-center justify-center text-gray-500">
    <Image
      src="/images/empty-products.svg"
      alt="No products found"
      width={150}
      height={150}
    />
    <p className="mt-4 text-black font-medium">No products found.</p>
    <p className="text-sm text-muted-foreground">
      Please check back later or try a different category.
    </p>
  </div>
);

const Page = () => {
  const router = useRouter();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [productsByCategory, setProductsByCategory] =
    React.useState<ProductsByCategory>({});
  const [productsHasOnTimeDelivery, setProductsHasOnTimeDelivery] =
    React.useState<ProductWithProps[]>([]);
  const [productsHasAfterSalesProtection, setProductsHasAfterSalesProtection] =
    React.useState<ProductWithProps[]>([]);
  const [flashDeals, setFlashDeals] = React.useState<ProductWithProps[]>([]);
  const [newArrivals, setNewArrivals] = React.useState<ProductWithProps[]>([]);
  const [topRankings, setTopRankings] = React.useState<ProductWithProps[]>([]);

  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
  const [isLoadingOnTimeDelivery, setIsLoadingOnTimeDelivery] =
    React.useState(true);
  const [isLoadingAfterSalesProtection, setIsLoadingAfterSalesProtection] =
    React.useState(true);
  const [flashDealsLoading, setFlashDealsLoading] = React.useState(true);
  const [newArrivalsLoading, setNewArrivalsLoading] = React.useState(true);
  const [topRankingsLoading, setTopRankingsLoading] = React.useState(true);

  // Fetch products for each category
  React.useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoadingCategories(true); // Set loading to true
      const newProductsByCategory: ProductsByCategory = {};
      for (const category of categories) {
        try {
          const response = await fetch(
            `/api/v1/product/category?slug=${categoryNameToSlug(category)}`
          );
          if (response.ok) {
            const data = await response.json();
            newProductsByCategory[category] = data.products;
          } else {
            console.error(`Failed to fetch products for category: ${category}`);
            newProductsByCategory[category] = [];
          }
        } catch (error) {
          console.error(
            `An error occurred while fetching products for category: ${category}`,
            error
          );
          newProductsByCategory[category] = [];
        }
      }
      setProductsByCategory(newProductsByCategory);
      setIsLoadingCategories(false);
    };

    fetchAllProducts();
  }, []);

  // Fetch products with on-time delivery
  React.useEffect(() => {
    const fetchOnTimeDeliveryProducts = async () => {
      setIsLoadingOnTimeDelivery(true);
      try {
        const response = await fetch("/api/v1/product/on-time-delivery");
        if (response.ok) {
          const data = await response.json();
          setProductsHasOnTimeDelivery(data.products);
        } else {
          console.error("Failed to fetch products with on-time delivery");
          setProductsHasOnTimeDelivery([]);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching on-time delivery products",
          error
        );
        setProductsHasOnTimeDelivery([]);
      } finally {
        setIsLoadingOnTimeDelivery(false);
      }
    };

    fetchOnTimeDeliveryProducts();
  }, []);

  // Fetch products with after-sales protection
  React.useEffect(() => {
    const fetchAfterSalesProtectionProducts = async () => {
      setIsLoadingAfterSalesProtection(true);
      try {
        const response = await fetch("/api/v1/product/after-sales-protection");
        if (response.ok) {
          const data = await response.json();
          setProductsHasAfterSalesProtection(data.products);
        } else {
          console.error("Failed to fetch products with after-sales protection");
          setProductsHasAfterSalesProtection([]);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching after-sales protection products",
          error
        );
        setProductsHasAfterSalesProtection([]);
      } finally {
        setIsLoadingAfterSalesProtection(false);
      }
    };

    fetchAfterSalesProtectionProducts();
  }, []);

  // Fetch flash deals products
  React.useEffect(() => {
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

  // Fetch new arrivals
  React.useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setNewArrivalsLoading(true);
        const url = `/api/v1/new-arrivals-products`;
        const response = await fetch(url);
        const data = await response.json();
        setNewArrivals(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setNewArrivalsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Fetch top rankings
  React.useEffect(() => {
    const fetchTopRankings = async () => {
      try {
        setTopRankingsLoading(true);
        const url = `/api/v1/top-ranking-products?sortBy=popularityScore`;
        const response = await fetch(url);
        const data = await response.json();
        setTopRankings(data);
      } catch (error) {
        console.error("Error fetching top rankings:", error);
      } finally {
        setTopRankingsLoading(false);
      }
    };

    fetchTopRankings();
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const imagesBanner = [
    {
      src: "https://s.alicdn.com/@sc04/kf/Hd15c29517b9f4f8cab9f50e67bacafc1d/229169913/Hd15c29517b9f4f8cab9f50e67bacafc1d.jpg_q60.jpg",
      link: "https://www.aliexpress.com/item/229169913.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i1/O1CN01efexJy1UlcDKPTcJB_!!6000000002558-0-tps-760-608.jpg",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i1/O1CN01BpX5r71NeYnRV4SF8_!!6000000001595-0-tps-760-608.jpg",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i2/O1CN01AkFjAd1dwuTxWlsRx_!!6000000003801-2-tps-760-608.png",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i4/O1CN01wuZByU27iecnr0AL3_!!6000000007831-2-tps-760-608.png",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i3/O1CN01ghTrQo1VeZhwJZBjr_!!6000000002678-2-tps-760-608.png",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
    {
      src: "https://s.alicdn.com/@img/imgextra/i1/O1CN01BpX5r71NeYnRV4SF8_!!6000000001595-0-tps-760-608.jpg",
      link: "https://www.aliexpress.com/item/1005005801234567.html",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <Header />
        <div className="w-full h-[250px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://s.alicdn.com/@img/imgextra/i1/O1CN01pHmBuq1j4IxrxKgd1_!!6000000004494-0-tps-7680-2324.jpg"
            alt="Promotions and Offers Background"
            fill
            className="size-full object-cover"
            priority
          />
          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-40 mt-32 text-white">
              <div className="flex items-center">
                <h1 className="text-2xl md:text-4xl font-semibold">
                  Promotions and Offers
                </h1>
                <p className="mx-4 mt-1">|</p>
                <p className="mt-2">
                  Discover the latest promotions and offers from businesses in
                  your area.
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className="py-20 px-20">
          <div className="grid lg:grid-cols-12 grid-cols-1 gap-5">
            {categories.map((category) => (
              <div className="lg:col-span-3" key={category}>
                <Card>
                  <CardHeader>
                    <CardTitle>Keep looking for</CardTitle>
                    <CardDescription>{category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      {isLoadingCategories ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <SkeletonCard key={i} />
                        ))
                      ) : productsByCategory[category]?.length > 0 ? (
                        productsByCategory[category]
                          .slice(0, 4)
                          .map((product: ProductWithProps) => {
                            const price =
                              product.variants.length > 0
                                ? Math.min(
                                    ...product.variants.map((v) => v.price)
                                  )
                                : product.price || 0;
                            const discounts = getDiscountInfo(product);
                            const discountPrice = calculateDiscountPrice(
                              price,
                              discounts
                            );
                            return (
                              <div
                                className="relative w-full h-24"
                                key={product.id}
                              >
                                <Image
                                  src={
                                    product.images[0] ||
                                    "https://placehold.co/220x220"
                                  }
                                  alt={product.name}
                                  fill
                                  className="size-full object-cover"
                                />
                                <div className="bg-gradient-to-r from-white/80 to-zinc-100 text-xs font-medium px-1.5 py-1 rounded-full absolute top-2 right-2">
                                  ₱{discountPrice}
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        // Show empty message if no products
                        <EmptyProductsMessage />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="lg:col-span-3">
              <div className="relative w-full overflow-hidden rounded-md">
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 2000,
                    }),
                  ]}
                  setApi={setApi}
                  className="w-full"
                >
                  <CarouselContent>
                    {imagesBanner.map((image, index) => (
                      <CarouselItem key={index}>
                        <Card className="p-0 m-0 w-full h-full border-none shadow-none">
                          <CardContent className="flex w-full h-[350px] relative items-center justify-center p-0">
                            <Image
                              src={image.src}
                              alt={`Slide ${index + 1}`}
                              fill
                              className="object-cover object-top"
                            />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Custom Navigation Buttons */}
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 hover:text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 hover:text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer z-20" />

                  {/* Radio buttons (dots) positioned absolutely within the carousel container */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20">
                    {Array.from({ length: count }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                          "h-3.5 w-3.5 cursor-pointer rounded-full",
                          {
                            "bg-white border-2 border-transparent":
                              current !== index + 1,
                            "bg-transparent border-2 border-white":
                              current === index + 1,
                          }
                        )}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>
            </div>
          </div>

          {/* Recommended for your business section */}
          <div className="flex max-w-lg mx-auto items-center justify-center my-8">
            <div className="flex-grow border-t border-gray-300 mr-3"></div>
            <span className="text-gray-600 text-lg whitespace-nowrap">
              Recommended for your business
            </span>
            <div className="flex-grow border-t border-gray-300 ml-3"></div>
          </div>

          <div className="mt-5 grid lg:grid-cols-2 grid-cols-1 gap-5">
            {/* 1MP Guaranteed Section */}
            <div className="w-full relative bg-[#682e2f] h-[450px] overflow-hidden rounded-md">
              <div
                className={`relative w-full ${productsHasOnTimeDelivery.length === 0 ? "h-[450px]" : "h-[200px]"}`}
              >
                <Image
                  src="https://s.alicdn.com/@img/imgextra/i2/O1CN01oekVig1pCRh00hDP5_!!6000000005324-0-tps-1428-360.jpg"
                  alt="Image"
                  fill
                  className="size-full"
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-orange-600 text-2xl font-bold">
                    On-time Delivery
                  </span>
                  <span className="text-white text-2xl font-bold">
                    Guaranteed
                  </span>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      Quick order and pay
                    </span>
                  </div>
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      On-time delivery
                    </span>
                  </div>
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      Money-back guarantee
                    </span>
                  </div>
                </div>

                <Button onClick={() => router.push("/on-time-shipping")} className="bg-white/30 rounded-full hover:bg-white/20 mb-6 w-fit">
                  Explore now
                </Button>

                <div className="grid grid-cols-4 gap-3 flex-1">
                  {isLoadingOnTimeDelivery ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  ) : productsHasOnTimeDelivery.length > 0 ? (
                    productsHasOnTimeDelivery.slice(0, 4).map((product) => {
                      const price =
                        product.variants.length > 0
                          ? Math.min(...product.variants.map((v) => v.price))
                          : product.price || 0;
                      const discounts = getDiscountInfo(product);
                      const discountPrice = calculateDiscountPrice(
                        price,
                        discounts
                      );
                      const newArrival = getTimeSinceListing(product);
                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-md overflow-hidden flex flex-col relative h-full"
                        >
                          <div className="relative flex-1">
                            <Image
                              src={
                                product.images[0] ||
                                "https://placehold.co/220x220"
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <p className="font-bold text-black text-lg">
                              ₱{discountPrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-[#800020]">
                              {newArrival}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 text-center flex flex-col mx-auto items-center justify-center text-gray-500">
                      <Image
                        src="/images/empty-products.svg"
                        alt="No products found"
                        width={200}
                        height={200}
                      />
                      <p className="mt-4 text-white font-medium">
                        No products found.
                      </p>
                      <p className="text-sm text-zinc-200">
                        Please check back later or try a different category.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fast Customization Section */}
            <div className="w-full relative bg-[#4A148C] h-[450px] overflow-hidden rounded-md">
              <div
                className={`relative w-full ${productsHasAfterSalesProtection.length === 0 ? "h-[450px]" : "h-[200px]"}`}
              >
                <Image
                  src="https://s.alicdn.com/@img/imgextra/i2/O1CN01hxygUf1OTr7VqyhRy_!!6000000001707-0-tps-2142-558.jpg"
                  alt="Free replacement parts"
                  fill
                  className="size-full rounded-md"
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white text-2xl">⚡</span>
                  <span className="text-white text-2xl font-bold">
                    After Sales Protection
                  </span>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      Free replacement parts
                    </span>
                  </div>
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      Free on-site installation
                    </span>
                  </div>
                  <div className="flex text-white items-center gap-2">
                    <IconCircleCheckFilled className="size-4 text-white" />
                    <span className="font-medium text-sm">
                      Free repair, maintenance and support
                    </span>
                  </div>
                </div>

                <Button onClick={() => router.push("/after-sales-protection")} className="bg-white/30 rounded-full hover:bg-white/20 mb-6 w-fit">
                  Explore now
                </Button>

                <div className="grid grid-cols-4 gap-3 flex-1">
                  {isLoadingAfterSalesProtection ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  ) : productsHasAfterSalesProtection.length > 0 ? (
                    productsHasAfterSalesProtection
                      .slice(0, 4)
                      .map((product) => {
                        const price =
                          product.variants.length > 0
                            ? Math.min(...product.variants.map((v) => v.price))
                            : product.price || 0;
                        const discounts = getDiscountInfo(product);
                        const discountPrice = calculateDiscountPrice(
                          price,
                          discounts
                        );
                        const newArrival = getTimeSinceListing(product);
                        return (
                          <div
                            key={product.id}
                            className="bg-white rounded-md overflow-hidden flex flex-col relative h-full"
                          >
                            <div className="relative flex-1">
                              <Image
                                src={
                                  product.images[0] ||
                                  "https://placehold.co/220x220"
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                                  {product.subCategory?.name || "Category"}
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="font-bold text-black text-lg">
                                ₱{discountPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600">
                                {newArrival}
                              </p>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="col-span-4 text-center flex flex-col mx-auto items-center justify-center text-gray-500">
                      <Image
                        src="/images/empty-products.svg"
                        alt="No products found"
                        width={200}
                        height={200}
                      />
                      <p className="mt-4 text-white font-medium">
                        No products found.
                      </p>
                      <p className="text-sm text-zinc-200">
                        Please check back later or try a different category.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100 p-6 rounded-md mt-10">
            <div className="flex mb-5 items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Top Deals
                </h1>
                <p className="mt-2 text-lg">
                  Score the lowest prices on 1 Market Philippines
                </p>
              </div>
              <Link
                className="flex items-center gap-1 hover:underline font-medium text-lg"
                href="/top-deals"
              >
                <span>View more</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>
            {flashDealsLoading ? (
              <FlashDealsSkeletonCarousel />
            ) : flashDeals.length > 0 ? (
              <Carousel className="w-full max-w-full">
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
              <EmptyProductsMessage />
            )}
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 mt-10 gap-10">
            <div className="bg-zinc-100 p-6 rounded-md">
              <div className="flex mb-5 items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    New Arrivals
                  </h1>
                  <p className="mt-2 text-lg">
                    Stay ahead with the latest offerings
                  </p>
                </div>
                <Link
                  className="flex items-center gap-1 hover:underline font-medium text-lg"
                  href="/new-arrivals"
                >
                  <span>View more</span>
                  <ChevronRight className="size-5" />
                </Link>
              </div>
              {newArrivalsLoading ? (
                <FlashDealsSkeletonCarousel gridCols={3} />
              ) : newArrivals.length > 0 ? (
                <Carousel className="w-full max-w-full">
                  <CarouselContent className="-ml-1">
                    {newArrivals.map((product) => {
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
                          className="pl-1 lg:basis-1/3"
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
                <EmptyProductsMessage />
              )}
            </div>
            <div className="bg-zinc-100 p-6 rounded-md">
              <div className="flex mb-5 items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Top Ranking
                  </h1>
                  <p className="mt-2 text-lg">
                    Navigate trends with data-driven rankings
                  </p>
                </div>
                <Link
                  className="flex items-center gap-1 hover:underline font-medium text-lg"
                  href="/top-ranking"
                >
                  <span>View more</span>
                  <ChevronRight className="size-5" />
                </Link>
              </div>
              {topRankingsLoading ? (
                <FlashDealsSkeletonCarousel gridCols={3} />
              ) : topRankings.length > 0 ? (
                <Carousel className="w-full max-w-full">
                  <CarouselContent className="-ml-1">
                    {topRankings.map((product) => {
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
                          className="pl-1 lg:basis-1/3"
                        >
                          <ProductCard
                            product={product}
                            price={price}
                            discounts={discounts}
                            hasDiscount={hasDiscount}
                            viewMode={"grid4"}
                            isTopRank
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
                <EmptyProductsMessage />
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
