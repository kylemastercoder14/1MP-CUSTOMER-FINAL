// components/globals/recommended-products.tsx

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductWithProps } from "@/types";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import ProductCard from "@/components/globals/product-card";

interface RecommendedProductsProps {
  // Common props
  vendorId: string; // Vendor ID is always required for both scenarios
  currentProductId?: string;
  limit?: number;
  errorTitle?: string;
  // Specific filter flags
  filterBySubcategory?: boolean; // New prop: true for "From the same store", false for "You may also like"
  categorySlug: string; // Renamed from 'categories' for clarity
}

const RecommendedProducts = ({
  vendorId,
  currentProductId,
  limit = 4,
  errorTitle = "No similar products found",
  filterBySubcategory = true, // Default to true, as the first usage needs it
  categorySlug, // Use categorySlug consistently
}: RecommendedProductsProps) => {
  const [products, setProducts] = React.useState<ProductWithProps[]>([]);
  const [productLoading, setProductLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setProductLoading(true);
      try {
        const response = await fetch("/api/v1/recommended-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId,
            productId: currentProductId,
            limit,
            // Pass the filter flag and category slug to the API
            filterBySubcategory,
            categorySlug,
          }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name: string }).name !== "AbortError"
        ) {
          console.error("Error fetching products:", error);
        }
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [
    vendorId,
    currentProductId,
    limit,
    filterBySubcategory, // Add new prop to dependencies
    categorySlug, // Add new prop to dependencies
  ]);

  if (productLoading) {
    return (
      <div className="lg:grid-cols-4 grid grid-cols-1 gap-4 mb-5">
        {[...Array(limit)].map((_, index) => ( // Use limit for skeleton count
          <Card
            key={index}
            className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div>
                <Skeleton className="h-40 w-full rounded-md mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <h3 className="text-lg font-medium">{errorTitle}</h3>
        <p className="text-muted-foreground">
          We couldn&apos;t find any products matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:grid-cols-4 grid grid-cols-1 gap-4 mb-5">
      {products.map((product) => {
        const price =
          product.variants.length > 0
            ? Math.min(...product.variants.map((v) => v.price))
            : product.price || 0;

        const discounts = getDiscountInfo(product);
        const hasDiscount = discounts.length > 0;
        const discountPrice = calculateDiscountPrice(price, discounts);

        return (
          <ProductCard
            key={product.id}
            product={product}
            price={price}
            discounts={discounts}
            hasDiscount={hasDiscount}
            viewMode="grid4"
            discountPrice={discountPrice}
            categories={product.categorySlug} // Pass actual category slug from product
            subcategories={product.subCategorySlug || ""} // Pass actual subcategory slug
          />
        );
      })}
    </div>
  );
};

export default RecommendedProducts;
