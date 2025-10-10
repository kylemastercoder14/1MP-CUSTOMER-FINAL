import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vendorId = (await params).id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    // Check if the user is already following the vendor
    const existingFollow = await db.followStore.findUnique({
      where: {
        userId_vendorId: {
          userId: userId,
          vendorId: vendorId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { success: false, message: "Already following this vendor." },
        { status: 409 }
      );
    }

    // Create a new follow record
    await db.followStore.create({
      data: {
        userId: userId,
        vendorId: vendorId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vendor followed successfully.",
    });
  } catch (error) {
    console.error("Error following vendor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to follow vendor.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vendorId = (await params).id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    // Check if the user is following the vendor
    const existingFollow = await db.followStore.findUnique({
      where: {
        userId_vendorId: {
          userId: userId,
          vendorId: vendorId,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { success: false, message: "Not following this vendor." },
        { status: 404 }
      );
    }

    // Delete the follow record
    await db.followStore.delete({
      where: {
        userId_vendorId: {
          userId: userId,
          vendorId: vendorId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vendor unfollowed successfully.",
    });
  } catch (error) {
    console.error("Error unfollowing vendor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to unfollow vendor.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
