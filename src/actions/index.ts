"use server";

import { OrderConfirmationEmailHTML } from "@/components/email-template/automated-receipt";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { sendMail } from "@/lib/email";

export const sendReceiptEmail = async (
  email: string,
  orderNumber: string,
  orderDate: string,
  customerName: string,
  shippingAddress: { homeAddress: string; zip: string },
  items: { name: string; quantity: number; price: number; image: string }[],
  subtotal: number,
  discountAmount: number,
  shippingCost: number,
  total: number
) => {
  try {
    const htmlContent = await OrderConfirmationEmailHTML({
      orderNumber,
      orderDate,
      customerName,
      shippingAddress,
      items,
      subtotal,
      discountAmount,
      shippingCost,
      total,
    });

    await sendMail(
      email,
      `Order Automated Receipt`,
      `Your order number is ${orderNumber}`,
      htmlContent
    );

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};

export const getProductsBySellerId = async (sellerId: string) => {
  try {
    const products = await db.product.findMany({
      where: { vendorId: sellerId },
      include: {
        vendor: true,
        category: true,
        subCategory: true,
        variants: true,
        productDiscount: true,
        newArrivalDiscount: true,
        specifications: true,
      },
    });

    return { products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: "Failed to fetch products" };
  }
};

export const signOut = async () => {
  (await cookies()).set("1MP-Authorization", "", { maxAge: 0, path: "/" });
};
