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

export async function GET(request: Request) {
  try {
    const { user } = await getAuthUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract sellerId from query parameters
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId || typeof sellerId !== "string") {
      return new NextResponse("Missing or invalid sellerId", { status: 400 });
    }

    // Check if conversation already exists
    let conversation = await db.conversation.findFirst({
      where: {
        userId: user.id,
        vendorId: sellerId,
      },
      include: {
        messages: {
          include: {
            product: {
              include: {
                vendor: true,
                category: true,
                subCategory: true,
                variants: true,
                productDiscount: true,
                newArrivalDiscount: true,
              },
            },
            senderUser: true,
            senderVendor: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        user: true, // Include user details
        vendor: true, // Include vendor details
        participants: true, // Include participants
      },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          vendor: {
            connect: { id: sellerId },
          },
          // Ensure participants are correctly created/connected based on your schema
          // This example assumes a separate Participant model or direct relation setup
          participants: {
            create: [
              { userId: user.id }, // Assuming userId is the foreign key for customer
              { vendorId: sellerId }, // Assuming sellerId is the foreign key for seller
            ],
          },
        },
        include: {
          messages: {
            include: {
              product: {
                include: {
                  vendor: true,
                  category: true,
                  subCategory: true,
                  variants: true,
                  productDiscount: true,
                  newArrivalDiscount: true,
                },
              },
              senderUser: true,
              senderVendor: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          user: true,
          vendor: true,
          participants: true,
        },
      });
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error("[GET_OR_CREATE_CONVERSATION_ERROR]", error);
    // Handle specific Prisma errors if needed, e.g., if sellerId doesn't exist
    return new NextResponse("Failed to get or create conversation", {
      status: 500,
    });
  }
}
