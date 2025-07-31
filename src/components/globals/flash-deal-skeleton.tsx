"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Skeleton Card Component
export const SkeletonCard = () => (
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

const FlashDealsSkeletonCarousel = ({gridCols = 5}: {gridCols?: number}) => (
  <Carousel className="w-full max-w-full mb-12">
    <CarouselContent className="-ml-1">
      {[...Array(5)].map((_, i) => (
        <CarouselItem key={i} className={`pl-1 basis-full md:basis-1/2 lg:basis-1/${gridCols}`}>
          <SkeletonCard />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

export default FlashDealsSkeletonCarousel;
