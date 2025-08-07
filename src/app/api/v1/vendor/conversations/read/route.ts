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
    const { conversationId, isUnread } = body;

    // Validate inputs
    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      typeof isUnread !== "boolean"
    ) {
      return new NextResponse("Invalid input for conversationId or isUnread", {
        status: 400,
      });
    }

    // Update the conversation's unread status
    const conversation = await db.conversation.update({
      where: { id: conversationId },
      data: { isUnread },
    });

    return NextResponse.json({ success: true, conversation }, { status: 200 });
  } catch (error) {
    console.error("[TOGGLE_READ_ERROR]", error);
    // Handle specific errors as needed
    return new NextResponse("Failed to toggle read status", { status: 500 });
  }
}
