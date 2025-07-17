// app/checkout/page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, WalletMinimal, Loader2, X, Banknote } from "lucide-react";
import { Address as AddressType, PromoCode } from "@prisma/client";

import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import useCart, { DeliveryOptionType } from "@/hooks/use-cart"; // Import DeliveryOptionType
import { useUser } from "@/hooks/use-user";

const CheckoutPage = () => {
  const router = useRouter();
  const {
    items,
    selectedItems,
    calculateVendorTotal, // This now returns shippingFee
    calculateCartTotal,   // This now returns totalShippingFee
    vendorVouchers,
    vendorCoupons,
    validateVoucher,
    applyVendorVoucher,
    // applyVendorCoupon is not used in this specific file's handlers
    removeVendorVoucher,
    removeItems,
    vendorDeliveryOptions, // Destructure new state
    setVendorDeliveryOption, // Destructure new action
  } = useCart();
  const { user: supabaseUser, loading: userLoading } = useUser();

  const [defaultAddress, setDefaultAddress] = useState<AddressType | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  // Removed selectedDeliveryOption from local state as it's now in useCart per vendor
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Online Transaction");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const [vendorVoucherInputs, setVendorVoucherInputs] = useState<Record<string, string>>({});
  const [voucherErrors, setVoucherErrors] = useState<Record<string, string>>({});


  // --- Authentication/Redirect check ---
  useEffect(() => {
    if (!userLoading && !supabaseUser) {
      router.push("/sign-in");
    }
  }, [userLoading, supabaseUser, router]);

  // --- Fetch Default Address ---
  const fetchDefaultAddress = useCallback(async () => {
    if (!supabaseUser || userLoading) return;
    setAddressLoading(true);
    try {
      const response = await fetch("/api/v1/customer/addresses", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch addresses.");
      }

      const result = await response.json();
      if (result.success) {
        const foundDefault = result.data.find((addr: AddressType) => addr.isDefault);
        setDefaultAddress(foundDefault || null);
      } else {
        toast.error(result.message || "Failed to load addresses.");
      }
    } catch (err: any) {
      console.error("Error fetching default address:", err);
      toast.error(err.message || "An error occurred while loading address.");
    } finally {
      setAddressLoading(false);
    }
  }, [supabaseUser, userLoading]);

  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  // --- Cart Items Grouping ---
  const selectedItemsByVendor = React.useMemo(
    () =>
      selectedItems.reduce(
        (acc, itemId) => {
          const item = items.find((i) => i.id === itemId);
          if (item) {
            if (!acc[item.vendorId]) {
              acc[item.vendorId] = [];
            }
            acc[item.vendorId].push(item);
          }
          return acc;
        },
        {} as Record<string, typeof items>
      ),
    [items, selectedItems]
  );

  // If there are no selected items, redirect to cart or homepage
  useEffect(() => {
    if (!userLoading && items.length > 0 && selectedItems.length === 0) {
      toast.warning("No items selected for checkout. Redirecting to cart.");
      router.push("/shopping-cart");
    }
    if (!userLoading && items.length === 0 && selectedItems.length === 0) {
        toast.info("Your cart is empty. Redirecting to homepage.");
        router.push("/");
    }
  }, [selectedItems.length, items.length, userLoading, router]);

  const handleVendorVoucherApply = async (
    vendorId: string,
    vendorPromoCodes: PromoCode[]
  ) => {
    const code = vendorVoucherInputs[vendorId]?.trim();
    if (!code) {
      setVoucherErrors((prev) => ({ ...prev, [vendorId]: "Please enter a voucher code" }));
      return;
    }
    const validation = await validateVoucher(vendorId, code, vendorPromoCodes);
    if (!validation.valid) {
      setVoucherErrors((prev) => ({ ...prev, [vendorId]: validation.message || "Invalid voucher" }));
      return;
    }
    if (validation.voucher) {
      applyVendorVoucher(vendorId, validation.voucher);
      setVendorVoucherInputs((prev) => ({ ...prev, [vendorId]: "" }));
      setVoucherErrors((prev) => ({ ...prev, [vendorId]: "" }));
    }
  };


  // --- Place Order Logic ---
  const handlePlaceOrder = async () => {
    if (!defaultAddress) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("No items selected for order.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    // Validate if a delivery option is selected for each vendor package
    const vendorsWithSelectedItems = Object.keys(selectedItemsByVendor);
    for (const vendorId of vendorsWithSelectedItems) {
      if (!vendorDeliveryOptions[vendorId]) {
        toast.error(`Please select a delivery option for ${items.find(i => i.vendorId === vendorId)?.vendorName || 'a vendor'} package.`);
        return;
      }
    }


    setIsProcessingOrder(true);
    toast.loading("Placing your order...", { id: "place-order-toast" });

    try {
      // Prepare order data
      const orderData = {
        shippingAddressId: defaultAddress.id,
        paymentMethod: selectedPaymentMethod,
        // Collect delivery option per vendor for backend
        vendorDeliveries: Object.keys(selectedItemsByVendor).map(vendorId => ({
            vendorId: vendorId,
            deliveryOption: vendorDeliveryOptions[vendorId],
            shippingFee: calculateVendorTotal(vendorId).shippingFee, // Get the calculated fee
        })),
        items: selectedItems.map(itemId => {
          const item = items.find(i => i.id === itemId);
          if (!item) throw new Error(`Item with ID ${itemId} not found.`);
          return {
            productId: item.productId,
            variantId: item.variant?.id,
            quantity: item.quantity,
            priceAtPurchase: item.discountedPrice,
            originalPrice: item.originalPrice,
            vendorId: item.vendorId,
          };
        }),
        vendorTotals: Object.keys(selectedItemsByVendor).map(vendorId => {
          const totals = calculateVendorTotal(vendorId);
          return {
            vendorId: vendorId,
            subtotal: totals.subtotal,
            discount: totals.discount,
            total: totals.total,
            voucherCode: vendorVouchers[vendorId]?.code || null,
            couponName: vendorCoupons[vendorId]?.name || null,
          };
        }),
        cartSummary: calculateCartTotal(), // Pass the full summary object
      };

      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      }

      const responseData = await response.json();
      toast.success("Order placed successfully!", { id: "place-order-toast" });

      const itemIdsToRemove = selectedItems;
      removeItems(itemIdsToRemove);

      router.push(`/order-confirmation?orderId=${responseData.orderId}`);


    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "An unexpected error occurred while placing your order.", { id: "place-order-toast" });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // --- Total Summary Calculations ---
  const cartSummary = calculateCartTotal();


  // --- Conditional Render based on User Loading and Authentication ---
  if (userLoading || addressLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center pt-[140px] pb-20">
        <Loader2 className="animate-spin h-16 w-16 text-[#800020]" />
      </div>
    );
  }

  if (!supabaseUser) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="pt-[140px] pb-20 px-4 md:px-8 lg:px-60 text-center text-muted-foreground">
          Your cart is empty. Nothing to checkout.
          <br/>
          <Link href="/" className="text-[#800020] hover:underline">Go to homepage</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return null;
  }


  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
      </div>
      <div className="px-4 md:px-8 lg:px-20 pb-20 pt-[140px]">
        <div className="grid lg:grid-cols-10 grid-cols-1 gap-3">
          {/* Left Section: Shipping Address, Packages, Delivery Options */}
          <div className="lg:col-span-7 space-y-3">
            {/* Shipping Address */}
            <div className="bg-white border rounded-sm py-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">Shipping Address</span>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 py-0 h-auto text-[#800020] hover:text-[#800020]"
                  onClick={() => router.push("/user/addresses")}
                >
                  Edit
                </Button>
              </div>
              {defaultAddress ? (
                <div>
                  <p className="font-semibold text-base">
                    {defaultAddress.fullName}{" "}
                    <span className="text-sm text-gray-600 font-normal">
                      ({defaultAddress.contactNumber})
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    {defaultAddress.homeAddress}, {defaultAddress.barangay}, {defaultAddress.city},{" "}
                    {defaultAddress.province}, {defaultAddress.region}, {defaultAddress.zipCode}
                  </p>
                  <span className="mt-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full inline-block">
                    HOME
                  </span>{" "}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No default address found. Please{" "}
                  <Link href="/user/addresses" className="text-[#800020] hover:underline">
                    add one
                  </Link>
                  .
                </div>
              )}
            </div>

            {/* Packages & Delivery Options */}
            {Object.entries(selectedItemsByVendor).map(([vendorId, vendorItems]) => {
              const vendor = vendorItems[0];
              const currentVendorDeliveryOption = vendorDeliveryOptions[vendorId] || "motorcycle-delivery"; // Default to motorcycle if not set

              return (
                <div key={vendorId} className="bg-white border rounded-sm mt-3 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">Package 1 of 1</span>
                    <span className="text-sm text-muted-foreground">
                      Shipped by{" "}
                      <span className="font-medium text-black">
                        {vendor.vendorName || "Vendor"}
                      </span>
                    </span>
                  </div>

                  <span className="text-sm text-muted-foreground mb-2 block">
                    Choose your delivery option
                  </span>
                  <RadioGroup
                    value={currentVendorDeliveryOption}
                    onValueChange={(value: DeliveryOptionType) => setVendorDeliveryOption(vendorId, value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center p-3 border rounded-md cursor-pointer has-[:checked]:border-[#800020] has-[:checked]:bg-[#800020]/5">
                      <RadioGroupItem value="motorcycle-delivery" id={`motorcycle-delivery-${vendorId}`} className="mr-3" />
                      <div className="flex-1">
                        <Label htmlFor={`motorcycle-delivery-${vendorId}`} className="flex justify-between items-center w-full cursor-pointer">
                          <div className="flex flex-col">
                            <span className="text-base font-medium">₱40.00</span>
                            <span className="text-sm text-muted-foreground">Motorcycle</span>
                            <span className="text-xs text-muted-foreground">Guaranteed by 45 minutes to 1 hour</span>
                          </div>
                          <CheckCircle2 className="size-5 text-[#800020] opacity-0 has-[:checked]:opacity-100 transition-opacity" />
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-md cursor-pointer has-[:checked]:border-[#800020] has-[:checked]:bg-[#800020]/5">
                      <RadioGroupItem value="bicycle-delivery" id={`bicycle-delivery-${vendorId}`} className="mr-3" />
                      <div className="flex-1">
                        <Label htmlFor={`bicycle-delivery-${vendorId}`} className="flex justify-between items-center w-full cursor-pointer">
                          <div className="flex flex-col">
                            <span className="text-base font-medium">₱30.00</span>
                            <span className="text-sm text-muted-foreground">Bicycle</span>
                            <span className="text-xs text-muted-foreground">Guaranteed by 1-2 hours</span>
                          </div>
                          <CheckCircle2 className="size-5 text-[#800020] opacity-0 has-[:checked]:opacity-100 transition-opacity" />
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-4 space-y-3">
                    {vendorItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative size-20 bg-zinc-200 flex-shrink-0">
                          {item.images.length > 0 && (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              Variant: {Object.values(item.variant.attributes).join(", ")}
                            </p>
                          )}
                          <p className="text-sm font-semibold mt-1">₱{item.discountedPrice.toFixed(2)}</p>
                          {item.originalPrice > item.discountedPrice && (
                            <span className="text-xs text-gray-400 line-through mr-2">
                              ₱{item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground flex-shrink-0">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white border rounded-sm py-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">Select payment method</span>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 py-0 h-auto text-[#800020] hover:text-[#800020]"
                >
                  View all methods {">"}
                </Button>
              </div>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex flex-col p-3 border rounded-md cursor-pointer has-[:checked]:border-[#800020] has-[:checked]:bg-[#800020]/5">
                  <div className="flex items-center">
                    <RadioGroupItem value="Online Transaction" id="payment-online-transaction" className="mr-3" />
                    <div className="flex-1">
                      <Label htmlFor="payment-online-transaction" className="flex items-center w-full cursor-pointer">
                        <Banknote className="size-5 mr-2 text-muted-foreground" />
                        <span className="text-base font-medium">Online Transaction</span>
                        <CheckCircle2 className="size-5 text-[#800020] opacity-0 has-[:checked]:opacity-100 transition-opacity ml-auto" />
                      </Label>
                    </div>
                  </div>
                  {selectedPaymentMethod === "Online Transaction" && (
                    <div className="w-full text-right mt-2 text-xs text-muted-foreground">
                      Powered by{" "}
                      <span className="font-semibold text-black">Xendit</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center p-3 border rounded-md cursor-pointer has-[:checked]:border-[#800020] has-[:checked]:bg-[#800020]/5">
                  <RadioGroupItem value="Cash on Delivery" id="payment-cod" className="mr-3" />
                  <div className="flex-1">
                    <Label htmlFor="payment-cod" className="flex items-center w-full cursor-pointer">
                      <WalletMinimal className="size-5 mr-2 text-muted-foreground" />
                      <span className="text-base font-medium">Cash on Delivery</span>
                      <CheckCircle2 className="size-5 text-[#800020] opacity-0 has-[:checked]:opacity-100 transition-opacity ml-auto" />
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Voucher Section */}
            <div className="bg-white border rounded-sm py-3 px-4">
              <span className="font-semibold text-lg">Voucher</span>
              <div className="mt-2 space-y-2">
                {Object.keys(selectedItemsByVendor).map(vendorId => {
                  const vendor = selectedItemsByVendor[vendorId][0];
                  const vendorPromoCodes = vendor.vendor?.promoCode || [];
                  const vendorVoucher = vendorVouchers[vendorId];
                  return (
                    <div key={vendorId}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{vendor.vendorName || "Vendor"} Voucher:</span>
                        {vendorVoucher ? (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs text-green-600">
                            <span>{vendorVoucher.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 text-green-600 hover:text-green-700"
                              onClick={() => removeVendorVoucher(vendorId)}
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Input
                              placeholder="Enter Voucher Code"
                              value={vendorVoucherInputs[vendorId] || ""}
                              onChange={(e) =>
                                setVendorVoucherInputs({
                                  ...vendorVoucherInputs,
                                  [vendorId]: e.target.value,
                                })
                              }
                              className="h-8 w-32 text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs bg-[#800020] hover:bg-[#800020]/90 text-white"
                              onClick={() => handleVendorVoucherApply(vendorId, vendorPromoCodes)}
                              disabled={!vendorVoucherInputs[vendorId]?.trim()}
                            >
                              APPLY
                            </Button>
                          </div>
                        )}
                      </div>
                      {voucherErrors[vendorId] && (
                        <p className="text-red-500 text-xs mt-1">{voucherErrors[vendorId]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice and Contact Info */}
            <div className="bg-white border rounded-sm py-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">Invoice and Contact Info</span>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 py-0 h-auto text-[#800020] hover:text-[#800020]"
                >
                  Edit
                </Button>
              </div>
              <p className="text-sm text-gray-700">Not set up yet.</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white border rounded-sm py-3 px-4">
              <span className="font-semibold text-lg">Order Summary</span>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({selectedItems.length} items)</span>
                  <span className="font-medium">
                    ₱{cartSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Discount</span>
                  <span className="font-medium text-green-600">
                    -₱{cartSummary.totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-medium">₱{cartSummary.totalShippingFee.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-lg text-[#800020]">
                  ₱{cartSummary.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Now Button */}
            <Button
              className="w-full mt-4 bg-[#800020] hover:bg-[#800020]/90 text-white py-3 rounded-sm text-base font-semibold"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isProcessingOrder || selectedItems.length === 0 || !defaultAddress || !selectedPaymentMethod}
            >
              {isProcessingOrder ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "PLACE ORDER NOW"
              )}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
