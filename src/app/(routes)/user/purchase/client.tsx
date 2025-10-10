"use client";

import { Order, OrderItem, Product, Vendor } from "@prisma/client";
import {
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// ─── ORDER STATUSES ────────────────────────────────────────────────
const ORDER_STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

// ─── STATUS COLORS AND ICONS ───────────────────────────────────────
const STATUS_COLORS = {
  Pending: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  "Out For Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Returned: "bg-orange-100 text-orange-700",
};

const STATUS_ICONS = {
  Pending: <Clock className="w-4 h-4" />,
  Processing: <RefreshCw className="w-4 h-4" />,
  "Out For Delivery": <Truck className="w-4 h-4" />,
  Delivered: <CheckCircle className="w-4 h-4" />,
  Cancelled: <XCircle className="w-4 h-4" />,
  Returned: <RefreshCw className="w-4 h-4" />,
};

// ─── STATUS LABEL MAP ───────────────────────────────────────────────
const mapOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    All: "All Orders",
    Pending: "To Pay",
    Processing: "To Ship",
    "Out For Delivery": "To Receive",
    Delivered: "Completed",
    Cancelled: "Canceled",
    Returned: "Returned",
  };
  return statusMap[status] || status;
};

// ─── TYPES ─────────────────────────────────────────────────────────
export interface OrderWithOrderItem extends Order {
  orderItem: (OrderItem & {
    product: Product;
    vendor: Vendor;
  })[];
}

// ─── GROUPED ORDERS BY VENDOR ──────────────────────────────────────
interface GroupedOrders {
  [vendorId: string]: {
    vendor: Vendor | null;
    orders: OrderWithOrderItem[];
  };
}

const Client = () => {
  const [orders, setOrders] = useState<OrderWithOrderItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    orderItem: OrderItem;
  } | null>(null);

  // ─── FETCH ORDERS ────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/v1/customer/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── FILTER ORDERS ───────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeTab !== "All") {
      result = result.filter((order) => order.status === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.orderItem.some((item) =>
            item.product.name.toLowerCase().includes(query)
          )
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // ─── GROUP ORDERS BY VENDOR ──────────────────────────────────────
  const groupedOrders = useMemo(() => {
    const grouped: GroupedOrders = {};

    filteredOrders.forEach((order) => {
      const firstItem = order.orderItem[0];
      const vendorId = firstItem?.vendor?.id || "unknown";

      if (!grouped[vendorId]) {
        grouped[vendorId] = {
          vendor: firstItem?.vendor || null,
          orders: [],
        };
      }

      grouped[vendorId].orders.push(order);
    });

    return grouped;
  }, [filteredOrders]);

  // ─── TAB COUNTS ─────────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: orders.length,
      Pending: 0,
      Processing: 0,
      "Out For Delivery": 0,
      Delivered: 0,
      Cancelled: 0,
      Returned: 0,
    };
    orders.forEach((order) => {
      if (counts[order.status] !== undefined) counts[order.status]++;
    });
    return counts;
  }, [orders]);

  // ─── HANDLERS ───────────────────────────────────────────────────
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const getStatusColor = (status: string) =>
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    "bg-gray-100 text-gray-700";

  const getStatusIcon = (status: string) =>
    STATUS_ICONS[status as keyof typeof STATUS_ICONS] || (
      <Clock className="w-4 h-4" />
    );

  const handleRateProduct = (product: Product, orderItem: OrderItem) => {
    setSelectedProduct({ product, orderItem });
    setRatingModalOpen(true);
  };

  // ─── ERROR STATE ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="md:px-[200px] px-10 pb-20 pt-24 flex flex-col items-center justify-center h-[60vh]">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-burgundy text-white rounded hover:bg-burgundy/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── UI ──────────────────────────────────────────────────────────
  return (
    <>
      <Modal
        title="Rate Your Purchase"
        className="max-w-xl"
        description="Rate your purchase and leave a review for the product."
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
      >
        {selectedProduct && <div>I will uncomment the rating form later</div>}
      </Modal>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* ✅ Tabs */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-max flex items-center">
            <div className="flex flex-row items-center gap-5 mb-3">
              {ORDER_STATUSES.map((status, index) => (
                <div
                  key={index}
                  onClick={() => setActiveTab(status)}
                  className={`flex flex-row gap-2 items-center border-b-2 pb-1 cursor-pointer transition-colors ${
                    activeTab === status
                      ? "border-[#800020] text-[#800020] font-bold"
                      : "border-transparent text-gray-500 hover:border-[#800020]"
                  }`}
                >
                  <h3>{mapOrderStatus(status)}</h3>
                  <span
                    className={`rounded-xl text-xs px-[6px] font-light ${
                      activeTab === status
                        ? "bg-[#800020] text-white"
                        : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  >
                    {tabCounts[status] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔍 Search bar */}
        <div className="flex items-center gap-2 w-full lg:w-[500px]">
          <div className="relative flex-1">
            <div className="border px-3 py-3 rounded-full flex items-center w-full">
              <input
                type="text"
                className="pl-2 border-none outline-none bg-transparent text-sm w-full"
                placeholder="Item name / Order ID"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Loading / Empty / Orders Section ─── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[30vh] mt-8">
          <Loader2 className='size-10 animate-spin' />
          <p className="mt-3 text-muted-foreground">Loading your orders...</p>
        </div>
      ) : Object.keys(groupedOrders).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] mt-8">
          <Image
            src="/icons/empty.svg"
            width={100}
            height={100}
            alt="Empty"
            priority
          />
          <p className="mt-1 text-muted-foreground">
            {searchQuery || activeTab !== "All"
              ? "No orders match your filter"
              : "You don't have any orders"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 mt-8">
          {Object.entries(groupedOrders).map(
            ([vendorId, { vendor, orders }]) => (
              <div key={vendorId} className="space-y-4">
                {/* Vendor Header */}
                <div className="flex items-center gap-3 pb-2 border-b">
                  <span className="font-semibold text-lg">
                    {vendor?.name || "Unknown Vendor"}
                  </span>
                  {vendor?.id && (
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="border text-xs text-zinc-500 px-2 py-1 flex items-center gap-1 hover:bg-gray-50"
                    >
                      <Store className="size-3.5" />
                      View Shop
                    </Link>
                  )}
                </div>

                {/* Orders under vendor */}
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Order header */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Order #:
                          </span>
                          <span className="font-medium text-sm">
                            {order.orderNumber}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold uppercase px-2 py-1 rounded ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {mapOrderStatus(order.status)}
                            </div>
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mt-2 space-y-4">
                        {order.orderItem.map((item) => (
                          <div
                            className="flex justify-between items-center"
                            key={item.id}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative w-24 h-24">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="rounded-md w-full h-full object-cover"
                                  sizes="(max-width: 768px) 100vw, 200px"
                                />
                              </div>
                              <div className="flex flex-col">
                                <p className="font-medium">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Quantity: {item.quantity}
                                </p>
                                {order.status === "Delivered" && (
                                  <div className="mt-2 flex gap-3">
                                    <Link
                                      href={`/products?slug=${item.product.slug}&categories=${item.product.categorySlug}&subcategories=${item.product.subCategorySlug}`}
                                      className="text-xs text-burgundy hover:underline"
                                    >
                                      Buy Again
                                    </Link>
                                    <span
                                      className="text-xs cursor-pointer text-burgundy hover:underline"
                                      onClick={() =>
                                        handleRateProduct(item.product, item)
                                      }
                                    >
                                      Rate Product
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-semibold">
                              ₱{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="mt-4 pt-2 border-t flex justify-between items-center">
                        <Button size="sm">Contact Vendor</Button>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Order Total:
                          </span>
                          <p className="text-lg text-burgundy font-semibold">
                            ₱{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Client;
