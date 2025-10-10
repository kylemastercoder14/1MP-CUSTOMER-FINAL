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
          connect: { id: userId },
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
