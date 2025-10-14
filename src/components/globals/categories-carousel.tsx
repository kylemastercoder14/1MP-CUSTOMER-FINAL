/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@prisma/client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

export function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const router = useRouter();

  // State to determine if the screen is mobile based on the Tailwind 'lg' breakpoint (1024px)
  const [isMobile, setIsMobile] = useState(false);
  const [api, setApi] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [current, setCurrent] = useState(0);

  // Effect to handle window resize and update the isMobile state
  useEffect(() => {
    const checkIsMobile = () => {
      // Set to true if the window width is less than the 'lg' breakpoint
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkIsMobile();
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Sync Carousel API for navigation
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    // Cleanup the event listener when the component unmounts or api changes
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Desktop Carousel Logic (7x2 grid)
  if (!isMobile) {
    // Split categories into pages of 14 (7x2 grid)
    const itemsPerPage = 14;
    const pages = [];
    for (let i = 0; i < categories.length; i += itemsPerPage) {
      pages.push(categories.slice(i, i + itemsPerPage));
    }

    return (
      <div className="mt-20 relative">
        <Carousel
          opts={{
            align: "start",
          }}
          setApi={setApi}
          className="w-full"
        >
          <div className="flex items-center">
            <CarouselContent className="flex-1">
              {pages.map((pageCategories, pageIndex) => (
                <CarouselItem key={pageIndex} className="basis-full">
                  <div className="space-y-6">
                    {/* First row - 7 items */}
                    <div className="grid grid-cols-7 gap-4">
                      {pageCategories.slice(0, 7).map((category) => (
                        <div
                          key={category.id}
                          onClick={() => router.push(`/category?name=${category.slug}`)}
                          className="flex cursor-pointer flex-col items-center justify-center group"
                        >
                          <div className="size-20 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Image
                              src={category.image || ""}
                              alt={category.name}
                              fill
                              className="object-cover size-full rounded-full"
                            />
                          </div>
                          <span className="text-xs group-hover:font-semibold mt-2 text-center text-gray-700 leading-tight">
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Second row - remaining 7 items */}
                    <div className="grid grid-cols-7 gap-4">
                      {pageCategories.slice(7, 14).map((category) => (
                        <div
                          key={category.id}
                          onClick={() => router.push(`/category?name=${category.slug}`)}
                          className="flex cursor-pointer flex-col items-center justify-center group"
                        >
                          <div className="size-20 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Image
                              src={category.image || ""}
                              alt={category.name}
                              fill
                              className="object-cover size-full rounded-full"
                            />
                          </div>
                          <span className="text-xs group-hover:font-semibold mt-2 text-center text-gray-700 leading-tight">
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 transform-none w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50" />
          <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 transform-none w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50" />
        </Carousel>
      </div>
    );
  }

  // Mobile Carousel Logic (single line)
  return (
    <div className="mt-14 relative px-4">
      <h2 className="text-xl font-bold mb-4">Shop by Categories</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/4 lg:basis-1/4">
              <div
                onClick={() => router.push(`/category?name=${category.slug}`)}
                className="flex cursor-pointer flex-col items-center justify-center group"
              >
                <div className="size-18 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center transition-transform duration-200">
                  <Image
                    src={category.image || ""}
                    alt={category.name}
                    fill
                    className="object-cover size-full rounded-full"
                  />
                </div>
                <span className="text-xs group-hover:font-semibold mt-2 text-center text-gray-700 leading-tight">
                  {category.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Mobile carousel navigation buttons */}
        <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 transform-none w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50" />
        <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 transform-none w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50" />
      </Carousel>
    </div>
  );
}
