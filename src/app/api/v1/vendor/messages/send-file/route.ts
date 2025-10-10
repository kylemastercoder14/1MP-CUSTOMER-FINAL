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
    const file = formData.get("file") as File;

    if (!sellerId || typeof sellerId !== "string" || !file) {
      return new NextResponse("Invalid input: sellerId or file missing", {
        status: 400,
      });
    }

    // ✅ Validate file type and size
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    // Optional: Restrict file types if needed
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Unsupported file type.", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    // ✅ Upload file to AWS S3
    const { url: fileUrl } = await uploadFile(
      file,
      "messages" // folder name in your S3 bucket
    );

    if (!fileUrl) {
      throw new Error("File upload to S3 failed.");
    }

    // ✅ Find the existing conversation
    const conversation = await db.conversation.findFirst({
      where: { userId, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // ✅ Save message record in database
    const message = await db.message.create({
      data: {
        body: "", // No text body for file messages
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: userId } },
        file: fileUrl, // Store S3 file URL
      },
      include: {
        senderUser: true,
        senderVendor: true,
        product: true,
      },
    });

    // ✅ Update last message timestamp
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("[SEND_FILE_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send file", { status: 500 });
  }
}
