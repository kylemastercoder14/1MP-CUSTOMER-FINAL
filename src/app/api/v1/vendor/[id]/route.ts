import db from "@/lib/db";
import { NextResponse } from "next/server";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vendorId = (await params).id;
    const { user } = await getAuthUser();

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required." },
        { status: 400 }
      );
    }

    const vendor = await db.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        vendorPolicies: true,
        vendorFaqs: true,
        product: {
          where: {
            adminApprovalStatus: "Approved",
          },
          include: {
            vendor: true,
            category: true,
            subCategory: true,
            variants: true,
            productDiscount: true,
            newArrivalDiscount: true,
          },
        },
        coupon: {
          where: {
            status: "Ongoing",
          },
        },
        followStore: true,
        orderItem: {
          where: {
            order: {
              status: "Delivered",
              paymentStatus: "Paid",
            },
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found." },
        { status: 404 }
      );
    }

    // Determine if the current user is following this vendor
    const isFollowedByUser = vendor.followStore.some(
      (follow) => follow.userId === user?.id
    );
    const followersCount = vendor.followStore.length;

    // Remove the `followStore` array from the response to keep it clean
    const { ...vendorData } = vendor;

    return NextResponse.json({
      success: true,
      message: "Vendor fetched successfully.",
      data: {
        ...vendorData,
        followersCount,
        isFollowedByUser,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vendor.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
