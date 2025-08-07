import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Coupon as PrismaCoupon } from "@prisma/client";
import { toast } from "sonner";

// Extend the Prisma Coupon type with an optional vendor name and image
interface CollectedCoupon extends PrismaCoupon {
  vendorName?: string;
  vendorImage?: string;
}

interface CouponStore {
  collectedCoupons: CollectedCoupon[];
  collectCoupon: (coupon: CollectedCoupon) => void;
  removeCoupon: (couponId: string) => void;
  isCouponCollected: (couponId: string) => boolean;
}

const useCoupon = create(
  persist<CouponStore>(
    (set, get) => ({
      collectedCoupons: [],

      // Action to collect a new coupon
      collectCoupon: (coupon) => {
        const { collectedCoupons } = get();
        // Check if the coupon is already in the collection
        if (collectedCoupons.find((c) => c.id === coupon.id)) {
          toast.info("You have already collected this voucher.");
          return;
        }

        // Add the new coupon and show a success toast
        set({ collectedCoupons: [...collectedCoupons, coupon] });
        toast.success("Voucher collected successfully!");
      },

      // Action to remove a coupon from the collection
      removeCoupon: (couponId) => {
        set({
          collectedCoupons: get().collectedCoupons.filter(
            (coupon) => coupon.id !== couponId
          ),
        });
        toast.success("Voucher removed.");
      },

      // Helper function to check if a coupon has been collected
      isCouponCollected: (couponId) => {
        return get().collectedCoupons.some((coupon) => coupon.id === couponId);
      },
    }),
    {
      name: "collected-vouchers-storage", // Unique name for local storage key
      storage: createJSONStorage(() => localStorage), // Use local storage
    }
  )
);

export default useCoupon;
