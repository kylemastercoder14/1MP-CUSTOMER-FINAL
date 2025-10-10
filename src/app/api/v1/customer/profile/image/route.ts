import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { uploadFile, deleteFile } from "@/lib/upload-s3";

export async function PUT(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    // Fetch the existing customer
    const customer = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, image: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer profile not found.", code: "CUSTOMER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const profileImageFile = formData.get("profileImage") as File | null;

    if (!profileImageFile) {
      return NextResponse.json(
        { message: "No image file provided.", code: "NO_IMAGE_FILE" },
        { status: 400 }
      );
    }

    // Validate file
    if (profileImageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 5MB.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png"].includes(profileImageFile.type)) {
      return NextResponse.json(
        {
          message: "Invalid file type. Only JPEG and PNG are allowed.",
          code: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // Create unique filename
    const folder = "customers";

    // ✅ Upload to AWS S3
    const { url: imageUrl } = await uploadFile(profileImageFile, folder);

    // 🗑️ Delete old image if exists
    if (customer.image) {
      try {
        const oldKey = customer.image.split(".amazonaws.com/").pop();
        if (oldKey) {
          await deleteFile(oldKey);
        }
      } catch (error) {
        console.warn("Failed to delete old profile image:", error);
      }
    }

    // 💾 Update user record in DB
    const updatedUser = await db.user.update({
      where: { id: customer.id },
      data: { image: imageUrl },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile picture updated!",
        imageUrl: updatedUser.image,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in profile image update route:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred during image update.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
