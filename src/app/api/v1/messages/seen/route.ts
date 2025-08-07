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
    // Check if the user is authenticated
    if (!user || !user.id) {
      // Ensure user.id exists
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body to get the messageId
    const body = await request.json();
    const { messageId } = body;

    // Validate messageId
    if (!messageId || typeof messageId !== "string") {
      return new NextResponse("Invalid messageId", { status: 400 });
    }

    // Update the message's seen status in the database using Prisma
    const message = await db.message.update({
      where: { id: messageId },
      data: {
        seenAt: new Date(),
        seenBy: {
          connect: { id: user.id },
        },
      },
      include: {
        seenBy: true, // Include the seenBy relation in the response if needed
      },
    });

    // Return a successful response with the updated message
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error("[MESSAGE_SEEN_ERROR]", error);
    // Handle specific errors or return a generic server error
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      // You might want to check for Prisma-specific errors here
      // For example, if the messageId doesn't exist (P2025 error code)
      // if (error.code === 'P2025') {
      //   return new NextResponse("Message not found", { status: 404 });
      // }
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
