/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const subCategorySlug = searchParams.get("subCategory");
    const sortBy = searchParams.get("sortBy") || "soldCount";

    const where: any = { adminApprovalStatus: "Approved" };
    let orderBy: Record<string, "asc" | "desc"> = {};

    // ✅ Category & Subcategory filters
    if (categorySlug) {
      where.categorySlug = categorySlug;
    }
    if (subCategorySlug) {
      where.subCategorySlug = subCategorySlug;
    }

    // ✅ Apply threshold filters based on sort type
    switch (sortBy) {
      case "popularityScore":
        where.popularityScore = { gte: 10 }; // only popular products
        orderBy = { popularityScore: "desc" };
        break;

      case "averageRating":
      case "bestReviewed": // alias
        where.averageRating = { gte: 3.5 }; // only products with good ratings
        orderBy = { averageRating: "desc" };
        break;

      case "soldCount":
        where.soldCount = { gte: 1 }; // only products with sales
        orderBy = { soldCount: "desc" };
        break;

      default:
        orderBy = { createdAt: "desc" };
    }

    // ✅ Fetch products
    const products = await db.product.findMany({
      where,
      include: {
        vendor: true,
        category: true,
        subCategory: true,
        variants: true,
        productDiscount: true,
      },
      orderBy,
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
