/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/globals/header";
import Footer from '@/components/globals/footer';

const Client = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/v1/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex flex-col items-center h-screen justify-center bg-gray-50 px-4">
        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Thank you for your purchase!
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          We’ve received your order and it will ship in once it confirm.
          <br />
          Your order number is{" "}
          <span className="font-semibold">#{order.orderNumber}</span>
        </p>

        <div className="mt-8 bg-white rounded-xl shadow-md w-full max-w-md">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
          </div>

          <div className="divide-y">
            {order.orderItem.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-700">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-t">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-semibold text-gray-800">
              ₱{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <Button onClick={() => router.push("/")} className="mt-8">
          Back to Home
        </Button>
      </div>
	  <Footer />
    </div>
  );
};

export default Client;
