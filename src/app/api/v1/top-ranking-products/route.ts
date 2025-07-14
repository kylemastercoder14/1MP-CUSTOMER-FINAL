/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const subCategorySlug = searchParams.get("subCategory");
    const sortBy = searchParams.get("sortBy") || "soldCount";

    let orderBy = {};
    const where: any = { adminApprovalStatus: "Approved" };

    // Filter by category if provided
    if (categorySlug) {
      where.categorySlug = categorySlug;
    }

    // Filter by subcategory if provided
    if (subCategorySlug) {
      where.subCategorySlug = subCategorySlug;
    }

    // Set sorting
    switch (sortBy) {
      case "soldCount":
        orderBy = { soldCount: "desc" };
        break;
      case "popularityScore":
        orderBy = { popularityScore: "desc" };
        break;
      case "bestReviewed":
        // TODO: For now, we'll sort by createdAt as a placeholder
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
