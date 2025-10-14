"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number | null;
  createdAt: string;
};

const NewArrivalProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/business-opportunity/new-arrivals")
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
      <p className="text-center text-muted-foreground mt-4">No new arrivals</p>
    );

  const firstTwo = products.slice(0, 2);
  const nextTwo = products.slice(2, 4);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">New arrivals</h3>
        <Link href="/new-arrivals" className="underline">
          View more
        </Link>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-xl">
            {products.length}+ products added this month
          </CardTitle>
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
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            {nextTwo.map((product) => (
              <div key={product.id} className="relative w-full h-[19vh]">
                <Image
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="size-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent>
          {products[0] && (
            <div className="flex items-center gap-3">
              <div className="relative w-[30%] h-[10vh]">
                <Image
                  src={products[0].images[0] || "/placeholder.png"}
                  alt={products[0].name}
                  fill
                  className="size-full object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">New this week</p>
                <p className="text-muted-foreground">
                  Products from verified sellers only
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewArrivalProducts;
