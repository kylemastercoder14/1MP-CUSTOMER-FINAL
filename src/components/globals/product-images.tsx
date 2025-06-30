"use client";

import Image from "next/image";
import React from "react";

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

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Ensure selectedIndex stays within bounds
  React.useEffect(() => {
    if (media.length > 0 && selectedIndex >= media.length) {
      setSelectedIndex(0);
    }
  }, [media.length, selectedIndex]);

  if (loading) {
    return (
      <div className="relative mt-5 grid grid-cols-10 gap-2">
        {/* Thumbnail Skeletons */}
        <div className="flex flex-col gap-2 col-span-1">
          {[...Array(5)].map((_, index) => (
            <div
              key={`skeleton-thumb-${index}`}
              className="cursor-pointer md:h-20 h-14 w-full relative bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* Main Image Skeleton */}
        <div className="md:h-[700px] h-[500px] col-span-9 relative bg-gray-200 animate-pulse" />
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
    <div className="relative mt-5 grid grid-cols-10 gap-2">
      {/* Thumbnail Images */}
      <div className="flex flex-col gap-2 col-span-1">
        {media.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`cursor-pointer md:h-20 h-14 w-full relative ${
              selectedIndex === index ? "border-2 border-[#800020]" : ""
            }`}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                muted
                autoPlay
                loop
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={item.src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="50vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Selected Image or Video */}
      <div className="md:h-[700px] h-[500px] col-span-9 relative">
        {selectedMedia.type === "video" ? (
          <video
            src={selectedMedia.src}
            className="object-cover w-full h-full"
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
            className="object-cover"
            sizes="50vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductImages;
