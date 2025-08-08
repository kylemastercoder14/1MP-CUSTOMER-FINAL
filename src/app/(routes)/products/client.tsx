/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/globals/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {
  calculateDiscountPrice,
  formatDiscountDateRange,
  formatText,
  getDiscountInfo,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import QuantityInput from "@/components/globals/quantity-input";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Loader2,
  Share,
  ShieldCheck,
  Star,
  WalletMinimal,
} from "lucide-react";
import Image from "next/image";
import { paymentMethods } from "@/constants";
import TabsComponent from "@/components/globals/tabs-component";
import { productTabs, ProductTabType, ProductWithProps } from "@/types";
import ProductImages from "@/components/globals/product-images";
import { ProductVariants } from "@/components/globals/product-variant";
import { ProductVariant } from "@prisma/client";
import RecommendedProducts from "@/components/globals/recommended-products";
import ProductAttributes from "@/components/globals/all-about-products/product-attributes";
import ProductReviews from "@/components/globals/all-about-products/product-reviews";
import ProductDescription from "@/components/globals/all-about-products/product-description";
import ProductPolicy from "@/components/globals/all-about-products/product-policy";
import useCart from "@/hooks/use-cart";
import VendorData from "@/components/globals/all-about-products/vendor-data";
import Footer from "@/components/globals/footer";
import { toast } from "sonner";

const Client = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, applyVendorVoucher, buyNowItem } = useCart();
  const slug = searchParams.get("slug") || "";
  const categories = searchParams.get("categories") || "";
  const subcategories = searchParams.get("subcategories") || "";
  const [product, setProduct] = useState<ProductWithProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ProductTabType>("Attributes");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // Derive the current product URL
  const productUrl = useMemo(() => {
    // Ensure window is defined for client-side execution
    if (typeof window !== "undefined" && product) {
      return `${window.location.origin}/products?slug=${product.slug}&categories=${product.categorySlug}&subcategories=${product.subCategorySlug}`;
    }
    return ""; // Default empty if not available
  }, [product]);

  useEffect(() => {
    const fetchProductAndLikeStatus = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch(`/api/v1/product/${slug}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productResponse.json();

        if (productData.success) {
          setProduct(productData.data);
          if (productData.data.variants?.length > 0) {
            setSelectedVariant(productData.data.variants[0]);
          }
          setIsLiked(productData.data.isLiked || false);
          setLikeCount(productData.data._count?.likes || 0);
        } else {
          console.error("Error fetching product:", productData.message);
        }
      } catch (error) {
        console.error("Error fetching product or like status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndLikeStatus();
  }, [slug]);

  // Calculate price based on selected variant or product price
  const price = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  }, [selectedVariant, product]);

  const activeDiscount = product?.productDiscount?.status === "Ongoing";
  const activeNewArrivalDiscount =
    product?.newArrivalDiscount?.status === "Ongoing";

  const discounts = product ? getDiscountInfo(product) : [];
  const hasDiscount = discounts.length > 0;
  const discountPrice = calculateDiscountPrice(price, discounts);

  const prepareItemForCart = useCallback(() => {
    if (!product) {
      toast.error("Product data is not available.");
      return null;
    }

    const itemToAdd = {
      productId: product.id,
      name: product.name,
      images: product.images,
      originalPrice: price,
      discountedPrice: discountPrice,
      vendorId: product.vendorId,
      vendorName: product.vendor.name || "",
      vendorImage: product.vendor.image || "",
      vendor: {
        id: product.vendorId,
        name: product.vendor.name || "",
        image: product.vendor.image || "",
        coupon: product.vendor.coupon || [],
        promoCode: product.vendor.promoCode || [],
      },
      quantity: quantity,
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            attributes: selectedVariant.attributes as Record<string, string>,
          }
        : undefined,
    };
    return itemToAdd;
  }, [product, price, discountPrice, quantity, selectedVariant]);

  const handleAddToCart = useCallback(() => {
    const item = prepareItemForCart();
    if (!item) return;

    const button = document.getElementById("add-to-cart-button");
    if (button) {
      button.setAttribute("disabled", "true");
      setTimeout(() => button.removeAttribute("disabled"), 1000);
    }

    addItem(item);
    toast.success(`${item.name} added to cart!`);

    // Apply any auto-applicable promo codes
    if (product?.vendor.promoCode && product.vendor.promoCode.length > 0) {
      const autoPromo = product.vendor.promoCode.find(
        (pc) => pc.status === "Ongoing"
      );
      if (autoPromo) {
        applyVendorVoucher(product.vendorId, {
          code: autoPromo.code,
          discountAmount: autoPromo.discountAmount ?? 0,
          discountType: autoPromo.type as "Percentage Off" | "Fixed Price",
        });
      }
    }
  }, [addItem, applyVendorVoucher, product, prepareItemForCart]);

  const handleBuyNow = useCallback(() => {
    const item = prepareItemForCart();
    if (!item) return;

    buyNowItem(item);

    if (product?.vendor.promoCode && product.vendor.promoCode.length > 0) {
      const autoPromo = product.vendor.promoCode.find(
        (pc) => pc.status === "Ongoing"
      );
      if (autoPromo) {
        applyVendorVoucher(product.vendorId, {
          code: autoPromo.code,
          discountAmount: autoPromo.discountAmount ?? 0,
          discountType: autoPromo.type as "Percentage Off" | "Fixed Price",
        });
      }
    }

    toast.loading("Redirecting to checkout...");
    router.push("/checkout");
  }, [buyNowItem, applyVendorVoucher, product, prepareItemForCart, router]);

  const handleShare = useCallback(async () => {
    if (!product || !productUrl) {
      toast.error("Product information not available for sharing.");
      return;
    }

    // Prepare data for sharing
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name} at 1 Market Philippines!`,
      url: productUrl,
    };

    try {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Product link shared successfully!");
      } else {
        // Fallback for browsers that don't support Web Share API
        // Copy to clipboard or open a simple dialog with options
        await navigator.clipboard.writeText(shareData.url);
        toast.info(
          "Product link copied to clipboard! You can paste it anywhere."
        );
        // Optionally, you could open a custom modal here with social media links
        // console.log("Web Share API not supported. URL copied:", shareData.url);
      }
    } catch (error: any) {
      // Explicitly type error as 'any' for now, or refine
      if (error.name === "AbortError") {
        // User cancelled the share operation
        // console.log('Share cancelled by user.');
      } else {
        console.error("Error sharing product:", error);
        toast.error(
          `Failed to share product: ${error.message || "Unknown error"}`
        );
      }
    }
  }, [product, productUrl]);

  const handleLike = useCallback(async () => {
    if (!product) {
      toast.error("Cannot like product: Product data not loaded.");
      return;
    }

    try {
      const response = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please log in to like products.");
          router.push("/sign-in");
          return;
        }

        throw new Error(`Failed to update like status: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Error liking/unliking product:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  }, [product, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="animate-spin h-16 w-16 text-[#800020]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
      </div>
      <div className="lg:px-20 lg:pb-20 px-5 pb-10 lg:pt-[140px] pt-20">
        <div className="grid lg:grid-cols-10 grid-cols-1 gap-5">
          <div className="lg:col-span-6 bg-white p-5 rounded-md border">
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="text-[#800020] hover:text-[#800020]"
                    >
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/components"
                      className="capitalize text-[#800020] hover:text-[#800020]"
                    >
                      {formatText(categories)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/components"
                      className="capitalize text-[#800020] hover:text-[#800020]"
                    >
                      {formatText(subcategories)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h3 className="text-lg font-semibold mt-4 mb-4 capitalize">
              {product?.name || "Product Name"}
            </h3>
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <Star className={`size-4 fill-current text-yellow-500`} />
                <Star className={`size-4 fill-current text-yellow-500`} />
                <Star className={`size-4 fill-current text-yellow-500`} />
                <Star className={`size-4 fill-current text-yellow-500`} />
                <Star className={`size-4 fill-half text-yellow-500`} />
                <span className="text-gray-500">4.9</span>
              </div>
              <p>|</p>
              <span className="text-muted-foreground">
                Reviews{" "}
                <span className="text-gray-600 font-medium">
                  {Math.floor(Math.random() * 2000) + 10}
                </span>
              </span>
            </div>
            <ProductImages
              images={product?.images || []}
              video={product?.video || ""}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-4 h-fit border p-5 bg-white rounded-md">
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {product?.soldCount !== undefined && product.soldCount > 100 && (
                <span
                  className={`text-sm bg-gradient-to-l from-blue-500 to-blue-800 text-white px-2 py-1 rounded-sm font-medium`}
                >
                  BEST SELLER
                </span>
              )}
              {activeNewArrivalDiscount && (
                <span
                  className={`text-sm bg-gradient-to-l from-emerald-500 to-emerald-800 text-white px-2 py-1 rounded-sm font-medium`}
                >
                  NEW ARRIVAL
                </span>
              )}
              {product?.onTimeDeliveryGuarantee && (
                <span
                  className={`text-sm bg-gradient-to-l from-orange-500 to-orange-800 text-white px-2 py-1 rounded-sm font-medium`}
                >
                  ON TIME DELIVERY GUARANTEE
                </span>
              )}
              {product?.onSiteServiceGuarantee && (
                <span
                  className={`text-sm bg-gradient-to-l from-violet-500 to-violet-800 text-white px-2 py-1 rounded-sm font-medium`}
                >
                  ON SITE SERVICE GUARANTEE
                </span>
              )}
              {product?.freeReplacementParts && (
                <span
                  className={`text-sm bg-gradient-to-l from-yellow-500 to-yellow-800 text-white px-2 py-1 rounded-sm font-medium`}
                >
                  FREE REPLACEMENT PARTS
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Brand:{" "}
              <span className="text-[#800020] font-normal">
                {product?.brand || "No Brand"}
              </span>{" "}
              |{" "}
              <span className="text-[#800020] font-normal">
                More {formatText(subcategories)} Products
              </span>
            </span>
            {activeDiscount && (
              <div className="bg-gradient-to-br from-red-500 rounded-md mt-3 to-[#800020] px-5 py-2 via-red-700 w-[400px]">
                <div className="flex items-center justify-between text-white">
                  <div className="max-w-40">
                    <h3 className="font-bold uppercase text-lg">
                      <span>
                        {product?.productDiscount?.discount || "Discount Title"}
                      </span>
                      <span className="bg-white text-[#800020] font-bold text-xs ml-2 rounded-sm px-1.5 py-0.5">
                        {formatDiscountDateRange(
                          product.productDiscount?.startDate || "",
                          product.productDiscount?.endDate || ""
                        )}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="text-yellow-300 text-lg font-bold">
                      UP TO{" "}
                      {product.productDiscount?.type === "Percentage Off"
                        ? `${product?.productDiscount?.value}% OFF`
                        : `₱${product?.productDiscount?.value} OFF`}
                    </h3>
                    <span className="text-center mx-auto font-semibold">
                      Shop Now!
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-5">
              <span className="font-black text-3xl text-[#800020]">
                <span className="text-lg font-semibold">₱</span>
                {discountPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-base font-semibold text-gray-400 line-through">
                  ₱{price.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-green-200 flex items-center mt-1 text-green-700 font-bold">
                    {discounts &&
                      discounts.some(
                        (d) => d.discountType === "Percentage Off"
                      ) &&
                      `${discounts.reduce(
                        (sum, d) =>
                          d.discountType === "Percentage Off"
                            ? sum + d.value
                            : sum,
                        0
                      )}%`}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-yellow-200 flex items-center mt-1 text-yellow-700 font-bold">
                    {discounts &&
                      discounts.some((d) => d.discountType === "Fixed Price") &&
                      `₱${discounts.reduce(
                        (sum, d) =>
                          d.discountType === "Fixed Price"
                            ? sum + d.value
                            : sum,
                        0
                      )}`}
                  </span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <ProductVariants
              variants={product?.variants || []}
              specifications={product?.specifications || []}
              onVariantSelect={(variant) => setSelectedVariant(variant)}
              selectedVariantId={selectedVariant?.id}
              sizeGuide={product?.sizeChart || null}
            />
            <span className="font-semibold text-lg mt-5">Shipping:</span>
            <div className="bg-zinc-100 px-4 py-2 rounded-sm mt-2 mb-5">
              <span>
                Shipping Fee: Est. ₱30.00 for motorcyle, ₱20.00 for bicycle
              </span>{" "}
              <br />
              <span>Estimated delivery in 1 hr to 3 hrs onwards.</span>
            </div>
            <span className="font-semibold text-lg mt-5">Quantity:</span>
            <QuantityInput quantity={quantity} setQuantity={setQuantity} />
            <div className="grid mt-5 lg:grid-cols-10 grid-cols-1 gap-3">
              <div className="flex lg:col-span-8 items-center gap-2">
                <Button
                  className="flex-1 border-[#800020] text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10"
                  size="lg"
                  variant="outline"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
                <Button
                  id="add-to-cart-button"
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
              <div className="flex items-center lg:col-span-2 gap-2">
                <Button
                  className="flex text-muted-foreground hover:bg-transparent text-sm flex-col items-center"
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 -mb-2" />
                  Share
                </Button>
                <Button
                  className="flex text-muted-foreground hover:bg-transparent text-sm flex-col items-center"
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-4 w-4 -mb-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  Like ({likeCount}) {/* Display like count */}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <span className="font-semibold text-lg">
                Protections for this product
              </span>
            </div>
            <div className="space-y-3 mt-2">
              <div>
                <div className="flex font-medium items-center gap-2">
                  <ShieldCheck className="size-4" />
                  Secure payments
                </div>
                <p className="ml-6">
                  Every payment you make on 1 Market Philippines is secured with
                  strict SSL encryption and PCI DSS data protection protocols
                </p>
                <div className="flex ml-6 mt-2 flex-wrap gap-2">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 relative`}
                      title={method.name}
                    >
                      <Image
                        alt={method.name}
                        src={method.src}
                        fill
                        className="size-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex font-medium items-center gap-2">
                  <WalletMinimal className="size-4" />
                  Easy Return & Refund
                </div>
                <p className="ml-6">
                  Claim a refund if your order is missing or arrives with
                  product issues.
                </p>
              </div>
            </div>
          </div>
        </div>
        <VendorData product={product} loading={loading} />
        <div className="bg-white p-5 mt-3 rounded-md border">
          <h3 className="text-lg font-semibold mb-3">From the same store</h3>
          <RecommendedProducts
            vendorId={product?.vendorId as string}
            currentProductId={product?.id}
            filterBySubcategory={true}
            categorySlug={product?.categorySlug as string}
            errorTitle="No other products from this store in this subcategory"
          />
          <TabsComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            items={productTabs}
          />
          {/* Tab Content */}
          <div className="mt-6 max-w-2xl">
            {activeTab === "Attributes" && (
              <ProductAttributes product={product} />
            )}
            {activeTab === "Reviews" && (
              <ProductReviews productId={product?.id as string} />
            )}
            {activeTab === "Description" && (
              <ProductDescription product={product} />
            )}
            {activeTab === "Policy" && <ProductPolicy product={product} />}
          </div>
        </div>
        <div className="bg-white p-5 mt-3 rounded-md border">
          <h3 className="text-lg font-semibold mb-3">You may also like</h3>
          <RecommendedProducts
            vendorId={product?.vendorId as string}
            currentProductId={product?.id}
            filterBySubcategory={false}
            categorySlug={product?.categorySlug as string}
            limit={12}
            errorTitle="No other products from this store found"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
