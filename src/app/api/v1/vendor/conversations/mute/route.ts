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
    const { conversationId, isMuted } = body;

    // Validate inputs
    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      typeof isMuted !== "boolean"
    ) {
      return new NextResponse("Invalid input for conversationId or isMuted", {
        status: 400,
      });
    }

    // Update the conversation's mute status
    const conversation = await db.conversation.update({
      where: { id: conversationId },
      data: { isMuted },
    });

    return NextResponse.json({ success: true, conversation }, { status: 200 });
  } catch (error) {
    console.error("[TOGGLE_MUTE_ERROR]", error);
    // Handle specific errors as needed
    return new NextResponse("Failed to toggle mute status", { status: 500 });
  }
}
