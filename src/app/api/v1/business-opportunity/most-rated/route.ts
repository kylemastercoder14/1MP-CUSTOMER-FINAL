import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Fetch top 5 products by averageRating
    const products = await db.product.findMany({
      where: {
        adminApprovalStatus: "Approved",
        vendor: {
          adminApproval: "Approved",
        },
      },
      orderBy: {
        averageRating: "desc", // highest rated first
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        averageRating: true,
        soldCount: true, // for best seller info
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch most rated products" },
      { status: 500 }
    );
  }
}
