"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MediaItem = {
  type: "image" | "video";
  src: string;
};

const ProductImages = ({
  images = [],
  video = null,
  loading = false,
}: {
  images?: string[];
  video?: string | null;
  loading?: boolean;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);

  // Safely combine video (if exists) with image list
  const media: MediaItem[] = React.useMemo(() => {
    if (loading) return [];

    const result: MediaItem[] = images.map((src) => ({
      type: "image",
      src,
    }));

    if (video) {
      result.unshift({
        type: "video",
        src: video,
      });
    }

    return result;
  }, [images, video, loading]);

  // Ensure selectedIndex stays within bounds
  useEffect(() => {
    if (media.length > 0 && selectedIndex >= media.length) {
      setSelectedIndex(0);
    }
  }, [media.length, selectedIndex]);

  // Effect to handle window resize and determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's 'lg' breakpoint
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state (separate layouts for desktop and mobile)
  if (loading) {
    return (
      <div className="relative mt-5 flex flex-col lg:grid lg:grid-cols-10 gap-2">
        {/* Thumbnail Skeletons (Responsive) */}
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden col-span-1 p-2 lg:p-0">
          {[...Array(5)].map((_, index) => (
            <div
              key={`skeleton-thumb-${index}`}
              className="cursor-pointer h-16 w-16 lg:h-20 lg:w-full relative bg-gray-200 animate-pulse flex-shrink-0"
            />
          ))}
        </div>

        {/* Main Image Skeleton (Responsive) */}
        <div className="h-[400px] lg:h-[700px] col-span-9 relative bg-gray-200 animate-pulse w-full lg:w-auto" />
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100">
        <p>No media available</p>
      </div>
    );
  }

  const selectedMedia = media[selectedIndex];

  return (
    <div className="relative mt-5 flex flex-col lg:grid lg:grid-cols-10 gap-2">
      {/* Main Selected Image or Video (Responsive) */}
      <div className="h-[400px] lg:h-[700px] lg:col-span-9 relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.src}
                className="object-contain w-full h-full"
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <Image
                src={selectedMedia.src}
                alt="Selected Image"
                fill
                className="object-contain"
                sizes="(max-width: 1023px) 100vw, 75vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Images (Responsive) */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden col-span-1 py-1 lg:p-0">
        {media.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            onClick={() => setSelectedIndex(index)}
            className={`cursor-pointer h-16 w-16 lg:h-20 lg:w-full relative flex-shrink-0 border-2 transition-all duration-200 ${
              selectedIndex === index ? "border-[#800020]" : "border-transparent hover:border-gray-300"
            }`}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                muted
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={item.src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 16vw, 10vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100';
                }}
              />
            )}
            {/* Overlay to show which is a video thumbnail */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
