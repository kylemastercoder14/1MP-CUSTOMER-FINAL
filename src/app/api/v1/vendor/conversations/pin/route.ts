import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

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
    const { user } = await getAuthUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { conversationId, isPinned } = body;

    // Validate inputs
    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      typeof isPinned !== "boolean"
    ) {
      return new NextResponse("Invalid input for conversationId or isPinned", {
        status: 400,
      });
    }

    // Update the conversation's pin status
    const conversation = await db.conversation.update({
      where: { id: conversationId },
      data: { isPinned },
    });

    return NextResponse.json({ success: true, conversation }, { status: 200 });
  } catch (error) {
    console.error("[TOGGLE_PIN_ERROR]", error);
    if (error instanceof Error) {
      // Handle cases where conversationId might not exist
      // For example, Prisma's P2025 error code for "record not found"
      // if (error.code === 'P2025') {
      //   return new NextResponse("Conversation not found", { status: 404 });
      // }
    }
    return new NextResponse("Failed to toggle pin status", { status: 500 });
  }
}
