import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { uploadFileToSupabase } from "@/lib/upload";

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

    const formData = await request.formData();
    const sellerId = formData.get("sellerId") as string;
    const imageFile = formData.get("image") as File;

    if (!sellerId || typeof sellerId !== "string" || !imageFile) {
      return new NextResponse("Invalid input: sellerId or image missing", {
        status: 400,
      });
    }

    // Upload the image file
    const uploadResult = await uploadFileToSupabase(
      imageFile,
      "customers",
      "messages"
    );

    if (!uploadResult || !uploadResult.url) {
      throw new Error("Image upload failed");
    }

    const conversation = await db.conversation.findFirst({
      where: { userId: user.id, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // Create user's message with image
    const message = await db.message.create({
      data: {
        body: "", // No text body for image messages
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: user.id } },
        image: uploadResult.url,
      },
      include: {
        senderUser: true,
        senderVendor: true,
        product: true,
      },
    });

    // Update last message time
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("[SEND_IMAGE_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send image", { status: 500 });
  }
}
