"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Star } from "lucide-react";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number | null;
  averageRating: number;
  soldCount: number;
};

const MostRatedProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/business-opportunity/most-rated")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin size-7" />
      </div>
    );

  if (!products.length)
    return (
      <p className="text-center text-muted-foreground mt-4">
        No rated products yet
      </p>
    );

  const firstTwo = products.slice(0, 2);
  const bestSeller = products[0];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // Full star
        stars.push(
          <Star
            key={i}
            className="w-3 h-3 inline-block text-yellow-500 mr-[1px]"
            fill="oklch(79.5% 0.184 86.047)"
          />
        );
      } else if (rating >= i - 0.5) {
        // Half star
        stars.push(
          <Star
            key={i}
            className="w-3 h-3 inline-block text-yellow-500 mr-[1px]"
            fill="oklch(79.5% 0.184 86.047)"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        );
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className="w-3 h-3 inline-block text-yellow-500 mr-[1px]"
            fill="none"
            stroke="oklch(79.5% 0.184 86.047)"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Top deals</h3>
        <Link href="/top-deals" className="underline">
          View more
        </Link>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-xl">Most rated products</CardTitle>
          <CardDescription className="text-base">
            Products with the highest ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {firstTwo.map((product) => (
              <div key={product.id} className="relative w-full h-[19vh]">
                <Image
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="size-full object-cover rounded-lg"
                />
                <div className="absolute top-4 flex items-center text-sm font-semibold left-4 bg-white rounded-lg px-3 py-2">
                  {renderStars(product.averageRating)}
                  <span className="text-xs ml-1">
                    ({product.averageRating.toFixed(1)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-xl">Best seller product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {bestSeller && (
              <div className="relative w-full h-[22vh]">
                <Image
                  src={bestSeller.images[0] || "/placeholder.png"}
                  alt={bestSeller.name}
                  fill
                  className="size-full object-cover rounded-lg"
                />
                <div className="absolute top-4 text-sm font-semibold left-4 bg-white rounded-lg px-3 py-2">
                  {bestSeller.soldCount}+ sold
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MostRatedProducts;
