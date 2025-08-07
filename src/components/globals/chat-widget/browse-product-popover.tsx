/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { getProductsBySellerId } from "@/actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search } from "lucide-react";
import { ProductWithProps } from "@/types";
import { calculateDiscountPrice, getDiscountInfo } from '@/lib/utils';

const BrowseProductPopover = ({
  sellerId,
  onProductSelect,
  disabled,
}: {
  sellerId: string | null;
  onProductSelect: (product: ProductWithProps) => void;
  disabled?: boolean;
}) => {
  const [products, setProducts] = React.useState<ProductWithProps[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [seller, setSeller] = React.useState<{
    image?: string | null;
    name?: string | null;
  } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductsBySellerId(sellerId!);
      setProducts(
        (res.products || []).map((product: any) => ({
          ...product,
          variants:
            product.variants?.map((variant: any) => ({
              ...variant,
              attributes:
                variant.attributes as import("@/types").VariantAttributes,
            })) || [],
        }))
      );
      if (res.products?.[0]?.vendor) {
        setSeller(res.products[0].vendor);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriceInfo = (product: ProductWithProps) => {
      const price =
        product.variants.length > 0
          ? Math.min(...product.variants.map((v) => v.price))
          : product.price || 0;

      const discounts = getDiscountInfo(product);
      const hasDiscount = discounts.length > 0;
      const discountPrice = calculateDiscountPrice(price, discounts);

      if (hasDiscount) {
        return {
          displayPrice: (
            <div className="flex flex-col">
              <span className="text-xs line-through text-muted-foreground">
                ₱{price.toLocaleString()}
              </span>
              <span className="text-xs text-primary font-medium">
                ₱{discountPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-green-600">
                {discounts.map((d) => d.value)}% OFF
              </span>
            </div>
          ),
          hasDiscount: true,
        };
      }

      return {
        displayPrice: (
          <span className="text-xs text-primary">₱{price.toLocaleString()}</span>
        ),
        hasDiscount: false,
      };
    };

  return (
    <div className="w-full p-2">
      {seller && (
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="size-4">
            <AvatarImage src={seller?.image || ""} />
            <AvatarFallback>{seller?.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">
            {seller?.name || "Unknown seller"}
          </span>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-lg border px-2 py-1">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full text-sm border-none bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4 overflow-y-auto h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No products found
          </p>
        ) : (
          filteredProducts.map((product) => {
            const priceInfo = getPriceInfo(product);

            return (
              <div key={product.id} className="rounded-lg border p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name || "Product image"}
                          fill
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="line-clamp-1 text-xs font-medium">
                        {product.name}
                      </h3>
                      {priceInfo.displayPrice}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <Button
                    size="sm"
                    disabled={disabled}
                    className="text-[11px] px-2 py-1 h-5 rounded-sm"
                    onClick={() => onProductSelect(product)}
                  >
                    Send
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BrowseProductPopover;
