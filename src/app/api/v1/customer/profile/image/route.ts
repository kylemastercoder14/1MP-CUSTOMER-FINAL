// app/api/v1/customer/profile/image/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await (await supabase).auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const supabaseUserId = session.user.id;

    // Fetch the existing customer from your DB to get their current image URL
    const customer = await db.user.findUnique({
      where: { authId: supabaseUserId },
      select: { id: true, image: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer profile not found.", code: "CUSTOMER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get the image file from FormData
    const formData = await request.formData();
    const profileImageFile = formData.get("profileImage") as File | null;

    if (!profileImageFile) {
      return NextResponse.json(
        { message: "No image file provided.", code: "NO_IMAGE_FILE" },
        { status: 400 }
      );
    }

    // Basic file validation (match client-side)
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

    const fileExt = profileImageFile.name.split(".").pop();
    const fileName = `${supabaseUserId}_${uuidv4()}.${fileExt}`; // Unique filename per user
    const filePath = `customers/${fileName}`; // Path in Supabase storage bucket

    const { data: uploadData, error: uploadError } = await (
      await supabase
    ).storage
      .from("customers")
      .upload(filePath, profileImageFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: profileImageFile.type,
      });

    if (uploadError) {
      console.error("Supabase image upload error:", uploadError);
      return NextResponse.json(
        {
          message: "Failed to upload profile image.",
          code: "IMAGE_UPLOAD_FAILED",
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = (await supabase).storage
      .from("customers")
      .getPublicUrl(uploadData.path);

    const imageUrl = publicUrlData.publicUrl;

    // Delete old profile picture if it exists and is different from the new one
    if (customer.image) {
      try {
        const oldPathSegments = customer.image.split("customers/").pop();
        if (oldPathSegments) {
          // This removes just the filename, assuming it's directly under 'customers/' or 'customers/profile-pictures/'
          // Adjust 'customers/' if your path structure is different.
          const pathToDelete = `customers/${oldPathSegments.split("/").pop()}`; // Adjust if your paths are nested
          const { error: deleteError } = await (await supabase).storage
            .from("customers")
            .remove([pathToDelete]);
          if (deleteError) {
            console.warn("Failed to delete old profile image:", deleteError);
          }
        }
      } catch (delError) {
        console.warn("Error processing old image path for deletion:", delError);
      }
    }

    // Update the user's image URL in your database
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
