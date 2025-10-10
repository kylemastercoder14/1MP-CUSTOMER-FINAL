import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sellerId, productId } = body;

    if (
      !sellerId ||
      typeof sellerId !== "string" ||
      !productId ||
      typeof productId !== "string"
    ) {
      return new NextResponse(
        "Invalid input: sellerId or productId missing/invalid",
        { status: 400 }
      );
    }

    const conversation = await db.conversation.findFirst({
      where: { userId: userId, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // Create user's message with product ID
    const message = await db.message.create({
      data: {
        body: "", // No text body for product messages
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: userId } },
        product: { connect: { id: productId } }, // Connect to the product
      },
      include: {
        senderUser: true,
        senderVendor: true,
        product: true, // Include the product details in the response
      },
    });

    // Update last message time
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("[SEND_PRODUCT_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send product", { status: 500 });
  }
}
