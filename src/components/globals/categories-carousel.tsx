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
import { useState } from "react";

export function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const router = useRouter();
  // Split categories into pages of 16 (7x2 grid)
  const itemsPerPage = 14;
  const pages = [];
  for (let i = 0; i < categories.length; i += itemsPerPage) {
    pages.push(categories.slice(i, i + itemsPerPage));
  }

  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  api?.on("select", () => {
    setCurrent(api.selectedScrollSnap());
  });

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
                        <div className="size-20 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center group-hover:scale-110">
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
                        <div className="size-20 relative rounded-full border group-hover:shadow-lg border-gray-200 bg-white flex items-center justify-center group-hover:scale-110">
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
        {current > 0 && (
          <CarouselPrevious className="transform-none w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 mb-2" />
        )}
        <CarouselNext className="transform-none w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50" />
      </Carousel>
    </div>
  );
}
