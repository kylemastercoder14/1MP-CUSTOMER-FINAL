"use client";

import { DiscountInfo, ProductWithProps } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { Lens } from "@/components/animated-ui/lens";
import { useRouter } from "next/navigation";

const ProductCard = ({
  product,
  price,
  discounts,
  hasDiscount,
  viewMode,
  discountPrice,
  categories,
  subcategories,
}: {
  product: ProductWithProps;
  price: number;
  discounts?: DiscountInfo[];
  hasDiscount: boolean;
  discountPrice: number;
  viewMode: "grid4" | "grid2" | "grid1";
  categories: string;
  subcategories: string;
}) => {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const handleThumbnailClick = (index: SetStateAction<number>) => {
    setSelectedImageIndex(index);
  };

  return (
    <Card
      onClick={() => router.push(`/products?slug=${product.slug}&categories=${categories}&subcategories=${subcategories}`)}
      className={`bg-white p-0 cursor-pointer rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 ${
        viewMode === "grid1" ? "flex" : ""
      }`}
    >
      <CardContent
        className={`p-4 ${viewMode === "grid1" ? "flex gap-4 w-full" : ""}`}
      >
        {/* Product Image */}
        <Lens hovering={hovering} setHovering={setHovering}>
          <div className="relative h-48 w-full mb-3 overflow-hidden rounded-sm bg-gray-100">
            {product.images?.[selectedImageIndex] && (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
              />
            )}
          </div>
        </Lens>

        {/* Product Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {product.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative h-8 w-8 flex-shrink-0 rounded border overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedImageIndex === index
                    ? "border-[#800020] border-2 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {product.images.length > 4 && (
              <div
                className="h-8 w-8 flex-shrink-0 rounded border border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer hover:border-gray-400"
                onClick={() => handleThumbnailClick(4)}
              >
                <span className="text-xs text-gray-500">
                  +{product.images.length - 4}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Discount Badges */}
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          {discounts &&
            discounts.map((discount, index) => (
              <span
                key={index}
                className={`text-[8px] ${
                  discount.type === "new-arrival"
                    ? "bg-emerald-500"
                    : discount.type === "product"
                      ? "bg-blue-500"
                      : "bg-[#800020]"
                } text-white px-2 py-1 rounded-full font-medium`}
              >
                {discount.discountType === "Percentage Off"
                  ? `${discount.value}% OFF`
                  : `SAVE ₱${discount.value}`}
              </span>
            ))}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-sm mb-1 line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-bold text-lg text-[#800020]">
            ₱{discountPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 line-through">
                ₱{price.toFixed(2)}
              </span>
              <span className="text-[10px] flex items-center gap-1 text-green-600 font-medium">
                {discounts &&
                  discounts.some((d) => d.discountType === "Percentage Off") &&
                  `Save ${discounts.reduce(
                    (sum, d) =>
                      d.discountType === "Percentage Off" ? sum + d.value : sum,
                    0
                  )}%`}
                <p className="text-muted-foreground">|</p>
                {discounts &&
                  discounts.some((d) => d.discountType === "Fixed Price") &&
                  `Save ₱${discounts.reduce(
                    (sum, d) =>
                      d.discountType === "Fixed Price" ? sum + d.value : sum,
                    0
                  )}`}
              </span>
            </div>
          )}
        </div>

        {/* Sales and Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium">{product.soldCount} sold</span>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">{"★".repeat(5)}</div>
            <span className="text-gray-500">
              ({Math.floor(Math.random() * 200) + 10})
            </span>
          </div>
        </div>

        {/* Location */}
        <p className="text-xs text-gray-500 truncate">{product.vendor.name}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
