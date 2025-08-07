import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("name");

  if (!categorySlug) {
    return NextResponse.json({
      success: false,
      message: "Category slug is required.",
    });
  }

  try {
    const categories = await db.category.findFirst({
      where: {
        slug: categorySlug,
      },
      include: {
        subCategories: true,
        product: {
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
        },
        vendor: {
          where: {
            adminApproval: "Approved",
          },
          include: {
            product: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch categories.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
