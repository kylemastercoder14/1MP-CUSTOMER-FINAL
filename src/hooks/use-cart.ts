/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Coupon, PromoCode } from "@prisma/client";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
  vendorImage?: string;
  vendor?: {
    id: string;
    name: string;
    image?: string;
    promoCode?: PromoCode[];
    coupon?: Coupon[];
  };
  variant?: {
    id: string;
    attributes: Record<string, string>;
  };
}

interface VendorVoucher {
  code: string;
  discountAmount: number;
  discountType: "Percentage Off" | "Fixed Price";
}

interface VendorCoupon {
  name: string;
  discountAmount: number;
  type: "Percentage Off" | "Fixed Price";
}

interface CartStore {
  items: CartItem[];
  selectedItems: string[];
  vendorVouchers: Record<string, VendorVoucher>;
  vendorCoupons: Record<string, VendorCoupon>;
  addItem: (data: {
    productId: string;
    name: string;
    images: string[];
    originalPrice: number;
    discountedPrice: number;
    vendorId: string;
    vendorName?: string;
    vendorImage?: string;
    vendor?: {
      id: string;
      name: string;
      image?: string;
      promoCode?: PromoCode[];
      coupon?: Coupon[];
    };
    variant?: {
      id: string;
      attributes: Record<string, string>;
    };
    quantity?: number;
  }) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
  setSelectedItems: (ids: string[]) => void;
  getItem: (id: string) => CartItem | undefined;
  toggleItemSelection: (id: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  toggleVendorSelection: (vendorId: string) => void;
  isVendorSelected: (vendorId: string) => boolean;
  getVendorItems: (vendorId: string) => CartItem[];
  applyVendorVoucher: (vendorId: string, voucher: VendorVoucher) => void;
  applyVendorCoupon: (vendorId: string, coupon: VendorCoupon) => void;
  removeVendorVoucher: (vendorId: string) => void;
  removeVendorCoupon: (vendorId: string) => void;
  calculateVendorTotal: (vendorId: string) => {
    subtotal: number;
    discount: number;
    total: number;
  };
  calculateCartTotal: () => number;
  validateVoucher: (
    vendorId: string,
    code: string,
    vendorPromoCodes: PromoCode[]
  ) => Promise<{
    valid: boolean;
    voucher?: VendorVoucher;
    message?: string;
  }>;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      selectedItems: [],
      vendorVouchers: {},
      vendorCoupons: {},

      addItem: (data) => {
        const currentItems = get().items;
        const id = data.variant
          ? `${data.productId}-${data.variant.id}`
          : data.productId;
        const quantity = data.quantity || 1;

        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
          toast.success("Item quantity updated in cart");
        } else {
          const newItem: CartItem = {
            id,
            productId: data.productId,
            name: data.name,
            images: data.images,
            originalPrice: data.originalPrice,
            discountedPrice: data.discountedPrice,
            quantity,
            vendorId: data.vendorId,
            vendorName: data.vendorName ?? "",
            vendorImage: data.vendorImage,
            vendor: data.vendor, // Add this line
            variant: data.variant,
          };
          set({ items: [...currentItems, newItem] });
          toast.success("Item added to cart");
        }
      },

      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
          selectedItems: get().selectedItems.filter((itemId) => itemId !== id),
        });
        toast.success("Item removed from cart");
      },

      removeItems: (ids: string[]) => {
        set({
          items: get().items.filter((item) => !ids.includes(item.id)),
          selectedItems: get().selectedItems.filter(
            (itemId) => !ids.includes(itemId)
          ),
        });
        toast.success("Items removed from cart");
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        toast.success("Quantity updated");
      },

      removeAll: () => {
        set({
          items: [],
          selectedItems: [],
          vendorVouchers: {},
          vendorCoupons: {},
        });
      },

      setSelectedItems: (ids: string[]) => {
        set({ selectedItems: ids });
      },

      getItem: (id: string) => {
        return get().items.find((item) => item.id === id);
      },

      toggleItemSelection: (id: string) => {
        const selectedItems = get().selectedItems;
        set({
          selectedItems: selectedItems.includes(id)
            ? selectedItems.filter((itemId) => itemId !== id)
            : [...selectedItems, id],
        });
      },

      selectAllItems: () => {
        set({ selectedItems: get().items.map((item) => item.id) });
      },

      deselectAllItems: () => {
        set({ selectedItems: [] });
      },

      toggleVendorSelection: (vendorId: string) => {
        const vendorItems = get().items.filter(
          (item) => item.vendorId === vendorId
        );
        const allSelected = vendorItems.every((item) =>
          get().selectedItems.includes(item.id)
        );

        if (allSelected) {
          set({
            selectedItems: get().selectedItems.filter(
              (id) => !vendorItems.some((item) => item.id === id)
            ),
          });
        } else {
          const vendorItemIds = vendorItems.map((item) => item.id);
          set({
            selectedItems: Array.from(
              new Set([...get().selectedItems, ...vendorItemIds])
            ),
          });
        }
      },

      isVendorSelected: (vendorId: string) => {
        const vendorItems = get().items.filter(
          (item) => item.vendorId === vendorId
        );
        return (
          vendorItems.length > 0 &&
          vendorItems.every((item) => get().selectedItems.includes(item.id))
        );
      },

      getVendorItems: (vendorId: string) => {
        return get().items.filter((item) => item.vendorId === vendorId);
      },

      applyVendorVoucher: (vendorId: string, voucher: VendorVoucher) => {
        set({
          vendorVouchers: {
            ...get().vendorVouchers,
            [vendorId]: voucher,
          },
        });
        toast.success("Voucher applied");
      },

      applyVendorCoupon: (vendorId: string, coupon: VendorCoupon) => {
        set({
          vendorCoupons: {
            ...get().vendorCoupons,
            [vendorId]: coupon,
          },
        });
        toast.success("Coupon applied");
      },

      removeVendorVoucher: (vendorId: string) => {
        const { [vendorId]: _, ...remaining } = get().vendorVouchers;
        set({ vendorVouchers: remaining });
        toast.success("Voucher removed");
      },

      removeVendorCoupon: (vendorId: string) => {
        const { [vendorId]: _, ...remaining } = get().vendorCoupons;
        set({ vendorCoupons: remaining });
        toast.success("Coupon removed");
      },

      calculateVendorTotal: (vendorId: string) => {
        const vendorItems = get().items.filter(
          (item) =>
            item.vendorId === vendorId && get().selectedItems.includes(item.id)
        );
        const subtotal = vendorItems.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );

        const voucher = get().vendorVouchers[vendorId];
        const coupon = get().vendorCoupons[vendorId];
        let discount = 0;

        if (voucher) {
          discount =
            voucher.discountType === "Percentage Off"
              ? subtotal * (voucher.discountAmount / 100)
              : Math.min(voucher.discountAmount, subtotal);
        }

        if (coupon) {
          const couponDiscount =
            coupon.type === "Percentage Off"
              ? subtotal * (coupon.discountAmount / 100)
              : coupon.discountAmount;
          discount += couponDiscount;
        }

        return {
          subtotal,
          discount,
          total: subtotal - discount,
        };
      },

      calculateCartTotal: () => {
        const vendorIds = [
          ...new Set(get().items.map((item) => item.vendorId)),
        ];
        return vendorIds.reduce((total, vendorId) => {
          const vendorTotal = get().calculateVendorTotal(vendorId);
          return total + vendorTotal.total;
        }, 0);
      },

      validateVoucher: async (vendorId, code, vendorPromoCodes) => {
        const trimmedCode = code.trim();
        if (!trimmedCode) {
          return { valid: false, message: "Please enter a voucher code" };
        }

        // Find matching promo code
        const promoCode = vendorPromoCodes.find(
          (pc) =>
            pc.code === trimmedCode &&
            pc.status === "Ongoing" &&
            new Date(pc.startDate) <= new Date() &&
            new Date(pc.endDate) >= new Date()
        );

        if (!promoCode) {
          return { valid: false, message: "Invalid or expired voucher code" };
        }

        // Check minimum spend requirement
        const vendorItems = get().items.filter(
          (item) =>
            item.vendorId === vendorId && get().selectedItems.includes(item.id)
        );
        const subtotal = vendorItems.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );

        if (promoCode.minimumSpend && subtotal < promoCode.minimumSpend) {
          return {
            valid: false,
            message: `Minimum spend of ₱${promoCode.minimumSpend.toFixed(2)} required`,
          };
        }

        return {
          valid: true,
          voucher: {
            code: promoCode.code,
            discountAmount: promoCode.discountAmount ?? 0,
            discountType: promoCode.type as "Percentage Off" | "Fixed Price",
          },
        };
      },
    }),
    {
      name: "1mp-final-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
