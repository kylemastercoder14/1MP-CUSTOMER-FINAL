import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const products = await db.product.count({
      where: {
        adminApprovalStatus: "Approved",
      },
    });

    const vendors = await db.vendor.count();

    const users = await db.user.count();

    const productCategories = await db.category.count();

    return NextResponse.json({
      success: true,
      data: {
        products,
        vendors,
        users,
        productCategories,
      },
      message: "Counts retrieved successfully",
    });
  } catch (error) {
    console.error("Error in counts route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
