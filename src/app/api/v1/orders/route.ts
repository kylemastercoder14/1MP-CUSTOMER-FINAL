/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db"; // Your Prisma client instance
import { createPayment } from "@/lib/xendit";
import { sendReceiptEmail } from "@/actions";
import { useUser } from "@/hooks/use-user";

// Define the POST handler for the API route
export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found in database");
      return NextResponse.json(
        { message: "User not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Parse the JSON body from the incoming request
    const orderData = await req.json();

    // Destructure necessary data from the frontend payload
    const {
      shippingAddressId,
      paymentMethod,
      vendorDeliveries, // Array of { vendorId, deliveryOption, shippingFee }
      items, // Array of items selected for order
      vendorTotals, // Array of { vendorId, subtotal, discount, total, voucherCode, couponName }
      cartSummary, // Object containing total, totalDiscount, totalShippingFee
    } = orderData;

    // --- Basic Input Validation ---
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

    // --- Data Transformation ---

    // 1. Generate a unique order number
    const orderNumber = uuidv4();

    // 2. Determine the overall vehicle type for the order
    const vehicleType =
      vendorDeliveries?.[0]?.deliveryOption?.type || "Standard"; // Default to 'Standard' if not specified

    // 3. Enrich order items with product 'name' and 'image'
    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { name: true, images: true }, // Assuming 'images' is an array of strings
        });

        if (!product) {
          throw new Error(
            `Product with ID ${item.productId} not found during order processing.`
          );
        }

        return {
          productId: item.productId,
          name: product.name,
          image: product.images[0] || null, // Take the first image, or null if no images
          quantity: item.quantity,
          sellerId: item.vendorId, // Map frontend 'vendorId' to backend 'sellerId'
          price: item.priceAtPurchase, // Map frontend 'priceAtPurchase' to backend 'price'
          productDiscountId: item.productDiscountId || null,
          newArrivalDiscountId: item.newArrivalDiscountId || null,
          couponId: item.couponId || null,
          promoCodeId: item.promoCodeId || null,
        };
      })
    );

    // 4. Collect applied coupon IDs
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

    // --- Conditional Payment Processing (Xendit vs. COD) ---
    let paymentStatus = "Pending"; // Default status
    let xenditInvoiceId: string | null = null;
    let xenditInvoiceUrl: string | null = null;

    if (paymentMethod === "Online Transaction") {
      try {
        // Prepare data for Xendit invoice creation
        const xenditPayload = {
          external_id: orderNumber, // Use orderNumber as external ID for Xendit
          payer_email: user.email || undefined, // Optional: User's email for Xendit invoice
          description: `Order #${orderNumber} from OneMarket`,
          amount: cartSummary.total,
          currency: "PHP", // Assuming Philippine Peso, adjust if needed
          success_redirect_url: `${req.headers.get("origin")}/order-confirmation?orderId=${orderNumber}&paymentStatus=success`,
          failure_redirect_url: `${req.headers.get("origin")}/checkout?status=failed&orderId=${orderNumber}`,
        };

        const xenditInvoice = await createPayment(xenditPayload);
        xenditInvoiceId = xenditInvoice.id;
        xenditInvoiceUrl = xenditInvoice.invoice_url;
        paymentStatus = "Awaiting Payment"; // Update payment status for online transactions
      } catch (xenditError: any) {
        console.error("Xendit payment creation error:", xenditError);
        return NextResponse.json(
          {
            message:
              xenditError.message || "Failed to initiate online payment.",
          },
          { status: 500 }
        );
      }
    } else if (paymentMethod === "Cash on Delivery") {
      paymentStatus = "Pending"; // For COD, payment is pending until delivery
    } else {
      return NextResponse.json(
        { message: "Invalid payment method." },
        { status: 400 }
      );
    }

    // --- Create the main order in the database ---
    const order = await db.order.create({
      data: {
        totalAmount: cartSummary.subtotal,
        discountAmount: cartSummary.totalDiscount,
        orderNumber: orderNumber,
        vehicleType: vehicleType,
        addressId: shippingAddressId,
        paymentMethod: paymentMethod,
        userId: user.id,
        deliveryFee: cartSummary.totalShippingFee,
        paymentStatus: paymentStatus, // Set payment status based on transaction type
        xenditInvoiceId: xenditInvoiceId, // Store Xendit invoice ID if applicable
      },
    });

    // Create order items with seller information
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

    // Handle coupons - decrement claimable quantity
    if (appliedCouponIds.length > 0) {
      await Promise.all(
        appliedCouponIds.map((couponId) =>
          db.promoCode.update({
            where: { id: couponId },
            data: { claimableQuantity: { decrement: 1 } }, // Decrement quantity
          })
        )
      );
    }

    // Prepare and send email
    const address = await db.address.findUnique({
      where: { id: shippingAddressId },
    });

    if (!address) {
      // This should ideally not happen if addressId is valid, but good to check
      console.warn(
        `Address with ID ${shippingAddressId} not found for order ${order.id}. Email not sent.`
      );
      // Continue without sending email, or return an error if address is critical for order finalization
    } else {
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
        address.fullName as string, // Assuming address has fullName
        {
          homeAddress,
          zip: address.zipCode,
        },
        enrichedItems.map((item) => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        enrichedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ), // Subtotal
        cartSummary.totalDiscount,
        cartSummary.totalShippingFee,
        cartSummary.total
      );
    }

    // --- Final Response ---
    if (paymentMethod === "Online Transaction" && xenditInvoiceUrl) {
      // For online transactions, return the Xendit invoice URL for redirection
      return NextResponse.json(
        {
          message: "Order initiated for online payment.",
          orderId: order.id,
          orderNumber: order.orderNumber,
          invoiceUrl: xenditInvoiceUrl, // Frontend will redirect to this URL
        },
        { status: 200 }
      );
    } else {
      // For Cash on Delivery, return success message
      return NextResponse.json(
        {
          message: "Order placed successfully!",
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("API Error placing order:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
