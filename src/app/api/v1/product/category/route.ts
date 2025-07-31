import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("slug");

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await db.product.findMany({
      where: {
        categorySlug: category,
      },
      include: {
        vendor: true,
        category: true,
        subCategory: true,
        variants: true,
        productDiscount: true,
      },
    });

    if (!response || response.length === 0) {
      return NextResponse.json(
        { error: "No products found for this category" },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: response });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
