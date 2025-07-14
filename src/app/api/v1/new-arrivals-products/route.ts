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
      // Only show products created in the last 30 days for "new arrivals"
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      newArrivalDiscountId: {
        not: null,
      },
      newArrivalDiscount: {
        startDate: { lte: new Date().toISOString() },
        endDate: { gte: new Date().toISOString() },
      },
    };

    // Filter by category if provided
    if (categorySlug) {
      where.categorySlug = categorySlug;
    }

    // Filter by subcategory if provided
    if (subCategorySlug) {
      where.subCategorySlug = subCategorySlug;
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
      orderBy: {
        createdAt: "desc",
      },
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
