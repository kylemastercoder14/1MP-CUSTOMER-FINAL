import { NextResponse } from "next/server";
import db from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const flashDealsPoducts = await db.product.findMany({
      where: {
        adminApprovalStatus: "Approved",
        productDiscountId: {
          not: null,
        },
        productDiscount: {
          startDate: { lte: new Date().toISOString() },
          endDate: { gte: new Date().toISOString() },
        },
      },
      take: 10,
      include: {
        vendor: true,
        category: true,
        subCategory: true,
        variants: true,
        productDiscount: true,
      },
      orderBy: {
        productDiscount: {
          value: "desc",
        },
      },
    });

    return NextResponse.json(flashDealsPoducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
