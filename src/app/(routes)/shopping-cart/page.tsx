/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import useCart from "@/hooks/use-cart";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, Heart, MapPin, StoreIcon, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import QuantityInput from "@/components/globals/quantity-input";
import { Input } from "@/components/ui/input";
import { Coupon, PromoCode, Address as AddressType } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const {
    items,
    selectedItems,
    removeItem,
    removeItems,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    toggleVendorSelection,
    isVendorSelected,
    vendorVouchers,
    vendorCoupons,
    applyVendorVoucher,
    applyVendorCoupon,
    removeVendorVoucher,
    removeVendorCoupon,
    calculateVendorTotal,
    calculateCartTotal,
    validateVoucher,
  } = useCart();

  const { user: supabaseUser, loading: userLoading } = useUser(); // Get user info to conditionally fetch address

  const [vendorVoucherInputs, setVendorVoucherInputs] = useState<
    Record<string, string>
  >({});
  const [voucherErrors, setVoucherErrors] = useState<Record<string, string>>(
    {}
  );
  // --- New state for default address ---
  const [defaultAddress, setDefaultAddress] = useState<AddressType | null>(
    null
  );
  const [addressLoading, setAddressLoading] = useState(true);
  // --- End new state ---

  // Group items by vendor
  const itemsByVendor = items.reduce(
    (acc, item) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = [];
      }
      acc[item.vendorId].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  const handleDeleteSelected = () => {
    removeItems(selectedItems);
  };

  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const handleVendorVoucherApply = async (
    vendorId: string,
    vendorPromoCodes: PromoCode[]
  ) => {
    const code = vendorVoucherInputs[vendorId]?.trim();
    if (!code) {
      setVoucherErrors((prev) => ({
        ...prev,
        [vendorId]: "Please enter a voucher code",
      }));
      return;
    }

    const validation = await validateVoucher(vendorId, code, vendorPromoCodes);
    if (!validation.valid) {
      setVoucherErrors((prev) => ({
        ...prev,
        [vendorId]: validation.message || "Invalid voucher",
      }));
      return;
    }

    if (validation.voucher) {
      applyVendorVoucher(vendorId, validation.voucher);
      setVendorVoucherInputs((prev) => ({ ...prev, [vendorId]: "" }));
      setVoucherErrors((prev) => ({ ...prev, [vendorId]: "" }));
    }
  };

  const handleCouponApply = (vendorId: string, coupon: Coupon) => {
    applyVendorCoupon(vendorId, {
      name: coupon.name,
      discountAmount: coupon.discountAmount ?? 0,
      type: coupon.type as "Percentage Off" | "Fixed Price",
    });
  };

  // --- Fetch Default Address ---
  const fetchDefaultAddress = useCallback(async () => {
    if (!supabaseUser || userLoading) return;
    setAddressLoading(true);
    try {
      const response = await fetch("/api/v1/customer/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch addresses.");
      }

      const result = await response.json();
      if (result.success) {
        const foundDefault = result.data.find(
          (addr: AddressType) => addr.isDefault
        );
        setDefaultAddress(foundDefault || null); // Set default or null if none found
      } else {
        toast.error(result.message || "Failed to load addresses.");
      }
    } catch (err: any) {
      console.error("Error fetching default address:", err);
      toast.error(err.message || "An error occurred while loading address.");
    } finally {
      setAddressLoading(false);
    }
  }, [supabaseUser, userLoading]); // Depend on supabaseUser and userLoading

  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
      </div>
      <div className="px-4 md:px-8 lg:px-60 pb-20 pt-[140px]">
        <div className="grid lg:grid-cols-10 grid-cols-1 gap-3">
          <div className="lg:col-span-7">
            {/* ... Select All / Delete button for cart items ... */}
            <div className="bg-white border rounded-sm py-2 px-3 flex items-center justify-between">
              <div className="flex text-sm text-muted-foreground items-center gap-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <span>SELECT ALL ({items.length} ITEM(S))</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>

            {Object.entries(itemsByVendor).map(([vendorId, vendorItems]) => {
              const vendorPromoCodes = vendorItems[0].vendor?.promoCode || [];
              const vendorCouponsList = vendorItems[0].vendor?.coupon || [];
              const isVendorFullySelected = isVendorSelected(vendorId);
              const vendorSelectedCount = vendorItems.filter((item) =>
                selectedItems.includes(item.id)
              ).length;
              const vendorVoucher = vendorVouchers[vendorId];
              const vendorCoupon = vendorCoupons[vendorId];
              const vendorTotal = calculateVendorTotal(vendorId);

              return (
                <div key={vendorId} className="bg-white border rounded-sm mt-3">
                  <div className="flex items-center justify-between py-2 px-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isVendorFullySelected}
                        onCheckedChange={() => toggleVendorSelection(vendorId)}
                      />
                      <div className="relative size-6 bg-zinc-200 flex items-center justify-center rounded-full">
                        {vendorItems[0].vendorImage ? (
                          <Image
                            src={vendorItems[0].vendorImage}
                            alt={vendorItems[0].vendorName || "Vendor"}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <StoreIcon className="size-3" />
                        )}
                      </div>
                      <p className="text-sm">
                        {vendorItems[0].vendorName || "Vendor"}
                        <span className="text-muted-foreground ml-1">
                          ({vendorSelectedCount}/{vendorItems.length} selected)
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {vendorCoupon ? (
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs text-blue-600">
                          <span>{vendorCoupon.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-blue-600 hover:text-blue-700"
                            onClick={() => removeVendorCoupon(vendorId)}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                            >
                              Apply Coupon
                              <ChevronDown className="ml-1 size-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Available Coupons
                              </h4>
                              {vendorCouponsList.length > 0 ? (
                                vendorCouponsList.map(
                                  (coupon: {
                                    name: string;
                                    id: string;
                                    startDate: Date;
                                    endDate: Date;
                                    type: string;
                                    discountAmount: number | null;
                                    minimumSpend: number | null;
                                    claimableQuantity: number;
                                    claimedQuantity: number;
                                    status: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vendorId: string;
                                  }) => (
                                    <div
                                      key={coupon.id}
                                      className="flex items-center justify-between p-2 text-xs border rounded-sm cursor-pointer hover:bg-gray-50"
                                      onClick={() =>
                                        handleCouponApply(vendorId, coupon)
                                      }
                                    >
                                      <div>
                                        <p className="font-medium">
                                          {coupon.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                          {coupon.type === "Percentage Off"
                                            ? `${coupon.discountAmount}% off`
                                            : `₱${coupon.discountAmount} off`}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                      >
                                        Apply
                                      </Button>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  No coupons available
                                </p>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
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
                            placeholder="Voucher code"
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
                            className="h-8 text-xs"
                            onClick={() =>
                              handleVendorVoucherApply(
                                vendorId,
                                vendorPromoCodes
                              )
                            }
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />

                  {vendorItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <div className="flex items-center py-3 px-3 gap-5">
                        <div className="w-[70%] flex items-center gap-2">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                          />
                          <div className="flex items-center gap-2">
                            <div className="relative size-20 bg-zinc-200">
                              {item.images.length > 0 && (
                                <Image
                                  src={item.images[0]}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="w-[50%]">
                              <p className="line-clamp-2 font-medium text-sm">
                                {item.name}
                              </p>
                              {item.variant && (
                                <p className="text-xs mt-1 text-muted-foreground">
                                  Variant:{" "}
                                  {Object.values(item.variant.attributes).join(
                                    ", "
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-[15%] flex flex-col items-center justify-center">
                          <p className="font-medium">
                            ₱{item.discountedPrice.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1">
                            {/* TODO: Work with save item */}
                            <Button variant="ghost" size="sm">
                              <Heart className="w-4 h-4" />
                              Save Item
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="w-[15%]">
                          <QuantityInput
                            quantity={item.quantity}
                            setQuantity={(q) =>
                              updateQuantity(
                                item.id,
                                typeof q === "number" ? q : item.quantity
                              )
                            }
                          />
                        </div>
                      </div>
                      <Separator />
                    </React.Fragment>
                  ))}

                  <div className="px-3 py-2 bg-gray-50 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₱{vendorTotal.subtotal.toFixed(2)}</span>
                    </div>
                    {vendorVoucher && (
                      <div className="flex justify-between text-green-600">
                        <span>Voucher Discount:</span>
                        <span>-₱{vendorTotal.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {vendorCoupon && (
                      <div className="flex justify-between text-blue-600">
                        <span>Coupon Discount:</span>
                        <span>-₱{vendorCoupon.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span>Vendor Total:</span>
                      <span>₱{vendorTotal.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border rounded-sm sticky top-28">
              <div className="py-2 px-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                  <Button
                    variant="link"
                    onClick={() => router.push("/user/addresses")}
                    size="sm"
                    className="px-0 py-0 h-auto text-[#800020] hover:text-[#800020]"
                  >
                    Change
                  </Button>
                </div>
                {/* Default Address Display */}
                {addressLoading ? (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Loading address...
                      </span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : defaultAddress ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">
                        {defaultAddress.fullName}{" "}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({defaultAddress.contactNumber})
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {defaultAddress.homeAddress}, {defaultAddress.barangay},{" "}
                      {defaultAddress.city}, {defaultAddress.province},{" "}
                      {defaultAddress.region}, {defaultAddress.zipCode}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">
                    No default address found. Please add one.
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 py-0 h-auto text-[#800020] hover:text-[#800020] ml-1"
                      onClick={() => router.push("/user/addresses")}
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
              <Separator />
              <div className="py-2 px-3">
                <h3 className="font-medium text-lg">Order Summary</h3>

                <div className="mt-4 space-y-3">
                  {Object.keys(itemsByVendor).map((vendorId) => {
                    const vendor = itemsByVendor[vendorId][0];
                    const vendorTotal = calculateVendorTotal(vendorId);
                    return (
                      <div key={vendorId} className="border-b pb-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {vendor.vendorName || "Vendor"}
                          </span>
                          <span>₱{vendorTotal.total.toFixed(2)}</span>
                        </div>
                        {vendorVouchers[vendorId] && (
                          <div className="text-xs text-green-600">
                            Voucher: {vendorVouchers[vendorId].code}
                          </div>
                        )}
                        {vendorCoupons[vendorId] && (
                          <div className="text-xs text-blue-600">
                            Coupon: {vendorCoupons[vendorId].name}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      ₱
                      {Object.keys(itemsByVendor)
                        .reduce(
                          (sum, vendorId) =>
                            sum + calculateVendorTotal(vendorId).subtotal,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Discount
                    </span>
                    <span className="font-medium text-green-600">
                      -₱
                      {Object.keys(itemsByVendor)
                        .reduce(
                          (sum, vendorId) =>
                            sum + calculateVendorTotal(vendorId).discount,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shipping Fee
                    </span>
                    <span className="font-medium">₱0.00</span>
                  </div>
                </div>

                <Separator className="my-3" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-lg text-[#800020]">
                    ₱{calculateCartTotal().total.toFixed(2)}
                  </span>
                </div>
                <Button onClick={() => router.push("/checkout")} className="w-full mt-4 bg-[#800020] hover:bg-[#800020]/90">
                  Proceed to Checkout ({selectedItems.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
