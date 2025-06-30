import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  vendorId: string;
  variant?: {
    id: string;
    attributes: Record<string, string>;
  };
}

interface CartStore {
  items: CartItem[];
  selectedItems: string[];
  addItem: (data: {
    productId: string;
    name: string;
    images: string[];
    originalPrice: number;
    discountedPrice: number;
    vendorId: string;
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
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      selectedItems: [],
      addItem: (data) => {
        const currentItems = get().items;
        const id = data.variant
          ? `${data.productId}-${data.variant.id}`
          : data.productId;
        const quantity = data.quantity || 1;

        // Check if item already exists in cart
        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem) {
          // Update quantity if item exists
          const updatedItems = currentItems.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
          toast.success("Item quantity updated in cart");
        } else {
          // Add new item with generated ID
          const newItem: CartItem = {
            id,
            productId: data.productId,
            name: data.name,
            image: data.images[0],
            originalPrice: data.originalPrice,
            discountedPrice: data.discountedPrice,
            quantity,
            vendorId: data.vendorId,
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
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        toast.success("Quantity updated");
      },
      removeAll: () => {
        set({ items: [], selectedItems: [] });
      },
      setSelectedItems: (ids: string[]) => {
        set({ selectedItems: ids });
      },
      getItem: (id: string) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "1mp-final-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
