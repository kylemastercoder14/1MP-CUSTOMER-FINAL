/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db"; // Prisma client
import { createPayment } from "@/lib/xendit";
import { sendReceiptEmail } from "@/actions";
import { useUser } from "@/hooks/use-user";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await useUser();
    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { message: "User not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Parse order data from frontend
    const orderData = await req.json();
    const {
      shippingAddressId,
      paymentMethod,
      remarks,
      vendorDeliveries,
      items,
      vendorTotals,
      cartSummary,
    } = orderData;

    // Basic validation
    if (
      !shippingAddressId ||
      !paymentMethod ||
      !items ||
      items.length === 0 ||
      !cartSummary
    ) {
      return NextResponse.json(
        { message: "Missing required order data." },
        { status: 400 }
      );
    }

    if (
      !cartSummary.total ||
      typeof cartSummary.totalDiscount === "undefined" ||
      typeof cartSummary.totalShippingFee === "undefined"
    ) {
      return NextResponse.json(
        { message: "Incomplete cart summary data." },
        { status: 400 }
      );
    }

    // Generate order number for Xendit
    const orderNumber = uuidv4();
    const vehicleType =
      vendorDeliveries?.[0]?.deliveryOption?.type || "Motorcycle";

    // Enrich order items with product details
    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { name: true, images: true },
        });
        if (!product)
          throw new Error(`Product with ID ${item.productId} not found`);

        return {
          productId: item.productId,
          name: product.name,
          image: product.images[0] || null,
          quantity: item.quantity,
          sellerId: item.vendorId,
          price: item.priceAtPurchase,
          productDiscountId: item.productDiscountId || null,
          newArrivalDiscountId: item.newArrivalDiscountId || null,
          couponId: item.couponId || null,
          promoCodeId: item.promoCodeId || null,
        };
      })
    );

    // Collect applied coupon IDs
    const voucherCodes = vendorTotals
      .map((vt: any) => vt.voucherCode)
      .filter(Boolean);
    let appliedCouponIds: string[] = [];
    if (voucherCodes.length > 0) {
      const coupons = await db.promoCode.findMany({
        where: { code: { in: voucherCodes } },
        select: { id: true },
      });
      appliedCouponIds = coupons.map((c) => c.id);
    }

    // Create order first
    const paymentStatus =
      paymentMethod === "Cash on Delivery" ? "Pending" : "Pending";
    const order = await db.order.create({
      data: {
        totalAmount: cartSummary.subtotal,
        discountAmount: cartSummary.totalDiscount,
        orderNumber,
        vehicleType,
        addressId: shippingAddressId,
        remarks,
        paymentMethod,
        userId: user.id,
        deliveryFee: cartSummary.totalShippingFee,
        paymentStatus,
        xenditInvoiceId: null,
      },
    });

    // Create order items
    await db.orderItem.createMany({
      data: enrichedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        orderId: order.id,
        vendorId: item.sellerId,
        productDiscountId: item.productDiscountId,
        newArrivalDiscountId: item.newArrivalDiscountId,
        couponId: item.couponId,
        promoCodeId: item.promoCodeId,
      })),
    });

    // Decrement coupon claimable quantity
    if (appliedCouponIds.length > 0) {
      await Promise.all(
        appliedCouponIds.map((couponId) =>
          db.promoCode.update({
            where: { id: couponId },
            data: { claimableQuantity: { decrement: 1 } },
          })
        )
      );
    }

    // Handle online payment with Xendit
    let xenditInvoiceId: string | null = null;
    let xenditInvoiceUrl: string | null = null;

    if (paymentMethod === "Online Transaction") {
      try {
        const xenditPayload = {
          external_id: orderNumber,
          payer_email: user.email || undefined,
          description: `Order #${orderNumber} from OneMarket`,
          amount: cartSummary.total,
          currency: "PHP",
          success_redirect_url: `${req.headers.get("origin")}/order-confirmation?orderId=${order.id}&paymentStatus=success`,
          failure_redirect_url: `${req.headers.get("origin")}/checkout?status=failed&orderId=${order.id}`,
        };

        const xenditInvoice = await createPayment(xenditPayload);
        xenditInvoiceId = xenditInvoice.id;
        xenditInvoiceUrl = xenditInvoice.invoice_url;

        // Update order with Xendit info
        await db.order.update({
          where: { id: order.id },
          data: { xenditInvoiceId, paymentStatus: "Awaiting Payment" },
        });
      } catch (err: any) {
        console.error("Xendit payment creation error:", err);
        return NextResponse.json(
          { message: err.message || "Failed to initiate online payment." },
          { status: 500 }
        );
      }
    }

    // Send receipt email
    const address = await db.address.findUnique({
      where: { id: shippingAddressId },
    });
    if (address) {
      const homeAddress = `${address.homeAddress}, ${address.barangay}, ${address.city}, ${address.province}, ${address.region}`;
      const formattedDate = new Date(order.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      await sendReceiptEmail(
        user.email as string,
        order.orderNumber,
        formattedDate,
        address.fullName as string,
        { homeAddress, zip: address.zipCode },
        enrichedItems.map((item) => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        enrichedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        cartSummary.totalDiscount,
        cartSummary.totalShippingFee,
        cartSummary.total
      );
    }

    // Final response
    return NextResponse.json(
      {
        message:
          paymentMethod === "Online Transaction"
            ? "Order initiated for online payment."
            : "Order placed successfully!",
        orderId: order.id,
        orderNumber: order.orderNumber,
        invoiceUrl: xenditInvoiceUrl || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error placing order:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
