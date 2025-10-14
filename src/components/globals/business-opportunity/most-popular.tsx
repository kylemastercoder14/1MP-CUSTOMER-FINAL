/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Product } from "@prisma/client";
import { Loader2 } from "lucide-react";

type PopularProduct = Product & { normalizedScore: number };

const MostPopularProducts = () => {
  const [products, setProducts] = useState<PopularProduct[]>([]);

  useEffect(() => {
    fetch("/api/v1/business-opportunity/most-popular")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const normalizedProducts: PopularProduct[] = data.products.map(
            (p: any) => ({ ...p, normalizedScore: p.normalizedScore })
          );
          setProducts(normalizedProducts);
        }
      });
  }, []);

  if (!products.length)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin size-7" />
      </div>
    );

  const mainProduct = products[0];
  const otherProducts = products.slice(1, 4); // show next 3
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Top ranking</h3>
        <Link href="/top-ranking" className="underline">
          View more
        </Link>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-xl">Most popular product</CardTitle>
          <CardDescription className="text-base">
            {mainProduct.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[40vh]">
            <Image
              src={mainProduct.images[0]}
              alt={mainProduct.name}
              fill
              className="size-full object-cover rounded-lg"
            />
            <div className="absolute top-4 text-sm font-semibold left-4 bg-white rounded-lg px-3 py-2">
              Popularity score: {mainProduct.normalizedScore.toFixed(1) ?? 0}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            {otherProducts.map((product) => (
              <div key={product.id} className="relative w-full h-[13vh]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="size-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MostPopularProducts;
