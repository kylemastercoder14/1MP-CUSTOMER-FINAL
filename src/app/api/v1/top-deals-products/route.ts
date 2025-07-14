/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const subCategorySlug = searchParams.get("subCategory");

    const where: any = {
      adminApprovalStatus: "Approved",
      OR: [{ productDiscount: { status: "Ongoing" } }],
    };

    if (categorySlug) where.categorySlug = categorySlug;
    if (subCategorySlug) where.subCategorySlug = subCategorySlug;

    const topDealsProducts = await db.product.findMany({
      where,
      include: {
        vendor: true,
        category: true,
        subCategory: true,
        variants: true,
        productDiscount: true,
        newArrivalDiscount: true,
      },
      orderBy: [
        // Sort by discount value first, then by popularity
        { productDiscount: { value: "desc" } },
        { popularityScore: "desc" },
      ],
    });

    return NextResponse.json(topDealsProducts);
  } catch (error) {
    console.error("Error fetching top deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch top deals" },
      { status: 500 }
    );
  }
}
