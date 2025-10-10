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
    const videoFile = formData.get("video") as File;

    if (!sellerId || typeof sellerId !== "string" || !videoFile) {
      return new NextResponse("Invalid input: sellerId or video missing", {
        status: 400,
      });
    }

    // ✅ Validate video file
    if (videoFile.size > 50 * 1024 * 1024) {
      // 50MB limit
      return NextResponse.json(
        { message: "Video file exceeds 50MB limit.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    const allowedVideoTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/x-matroska",
    ];
    if (!allowedVideoTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { message: "Unsupported video format.", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    // ✅ Upload video to AWS S3
    const { url: videoUrl } = await uploadFile(
      videoFile,
      "messages" // Folder in your S3 bucket for chat messages
    );

    if (!videoUrl) {
      throw new Error("Video upload to S3 failed.");
    }

    // ✅ Find the existing conversation
    const conversation = await db.conversation.findFirst({
      where: { userId, vendorId: sellerId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // ✅ Create the message record in the database
    const message = await db.message.create({
      data: {
        body: "", // No text content for video message
        conversation: { connect: { id: conversation.id } },
        senderUser: { connect: { id: userId } },
        video: videoUrl, // Store AWS S3 video URL
      },
      include: {
        senderUser: true,
        senderVendor: true,
        product: true,
      },
    });

    // ✅ Update conversation timestamp
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (error) {
    console.error("[SEND_VIDEO_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send video", { status: 500 });
  }
}
