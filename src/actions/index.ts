"use server";

import nodemailer from "nodemailer";
import { OrderConfirmationEmailHTML } from "@/components/email-template/automated-receipt";
import db from "@/lib/db";

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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "onemarketphilippines2025@gmail.com",
      pass: "vrbscailgpflucvn",
    },
  });

  const message = {
    from: "onemarketphilippines2025@gmail.com",
    to: email,
    subject: "Order Automated Receipt",
    text: `Your order number is ${orderNumber}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

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
