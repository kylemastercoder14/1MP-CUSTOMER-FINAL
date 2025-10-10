import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { uploadFile } from "@/lib/upload-s3";

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

    const formData = await request.formData();
    const sellerId = formData.get("sellerId") as string;
    const imageFile = formData.get("image") as File;

    if (!sellerId || typeof sellerId !== "string" || !imageFile) {
      return new NextResponse("Invalid input: sellerId or image missing", {
        status: 400,
      });
    }

    // ✅ Validate file
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size exceeds 5MB limit.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json(
        { message: "Invalid image type.", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    // ✅ Upload image to AWS S3
    const { url: imageUrl } = await uploadFile(
      imageFile,
      "messages" // S3 folder for message images
    );

    if (!imageUrl) {
      throw new Error("Image upload to S3 failed");
    }

    // ✅ Find or verify the conversation
    const conversation = await db.conversation.findFirst({
      where: { userId, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // ✅ Create a new message entry in the database
    const message = await db.message.create({
      data: {
        body: "", // Empty because this is an image message
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: userId } },
        image: imageUrl, // Store S3 image URL
      },
      include: {
        senderUser: true,
        senderVendor: true,
        product: true,
      },
    });

    // ✅ Update the conversation’s last message timestamp
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
