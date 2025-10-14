import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Fetch products created in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const products = await db.product.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        adminApprovalStatus: "Approved",
        vendor: {
          adminApproval: "Approved",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch new arrivals" },
      { status: 500 }
    );
  }
}
