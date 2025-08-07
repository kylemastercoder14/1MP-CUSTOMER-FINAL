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
    const { sellerId, messageBody } = body;

    if (
      !sellerId ||
      typeof sellerId !== "string" ||
      !messageBody ||
      typeof messageBody !== "string"
    ) {
      return new NextResponse(
        "Invalid input: sellerId or messageBody missing/invalid",
        { status: 400 }
      );
    }

    // Find the conversation, including existing messages to check if it's the first message
    const conversation = await db.conversation.findFirst({
      where: { userId: user.id, vendorId: sellerId },
      include: { messages: true }, // Include messages to check for first message
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found or not created yet." },
        { status: 404 }
      );
    }

    // Create user's message
    const message = await db.message.create({
      data: {
        body: messageBody,
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: user.id } },
      },
      include: {
        senderUser: true, // Include senderUser for frontend display
        senderVendor: true, // Include senderVendor for frontend display
        product: true, // Include product if it's a product message (though not for text)
      },
    });

    // Update last message time
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Check if first message to trigger auto-reply
    const isFirstMessage = conversation.messages.length === 0;

    if (isFirstMessage) {
      const automatedResponse = await db.automatedResponse.findFirst({
        where: { vendorId: sellerId }, // Changed sellerId to vendorId
      });

      if (automatedResponse) {
        const now = new Date();
        const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const workingHours = automatedResponse.workingHours as Record<
          string,
          { start: string; end: string }
        >;
        const todaysHours = workingHours[dayOfWeek];

        let autoReplyMessage = automatedResponse.defaultMessage;

        if (todaysHours) {
          const startTime = parseInt(todaysHours.start.replace(":", ""));
          const endTime = parseInt(todaysHours.end.replace(":", ""));

          if (currentTime < startTime || currentTime > endTime) {
            autoReplyMessage = automatedResponse.offWorkMessage;
          }
        }

        // Create auto-reply as seller's message
        if (autoReplyMessage) {
          const autoReply = await db.message.create({
            data: {
              body: autoReplyMessage,
              conversation: { connect: { id: conversation.id } },
              senderVendor: { connect: { id: sellerId } }, // Changed senderSeller to senderVendor
              isAutoReply: true,
            },
            include: {
              senderUser: true,
              senderVendor: true,
              product: true,
            },
          });

          return NextResponse.json(
            { success: true, message, autoReply },
            { status: 200 }
          );
        }
      }
    }

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("[SEND_TEXT_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send message", { status: 500 });
  }
}
