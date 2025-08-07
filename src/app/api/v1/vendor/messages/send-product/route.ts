import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// Helper function to get authenticated user (from your previous code)
async function getAuthUser() {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await (await supabase).auth.getSession();

  if (sessionError || !session) {
    return {
      error: NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      ),
    };
  }

  const supabaseUserId = session.user.id;
  const user = await db.user.findUnique({
    where: { authId: supabaseUserId },
    select: { id: true },
  });

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      ),
    };
  }

  return { user };
}

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return authError;
    }
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      where: { userId: user.id, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // Create user's message with product ID
    const message = await db.message.create({
      data: {
        body: "", // No text body for product messages
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: user.id } },
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
