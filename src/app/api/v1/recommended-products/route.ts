import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
      subcategories,
      vendorId,
      productId,
      limit = 4,
    } = await request.json();

    if (!subcategories) {
      return NextResponse.json(
        { error: "Subcategory is required." },
        { status: 400 }
      );
    }

    const products = await db.product.findMany({
      where: {
        adminApprovalStatus: "Approved",
        subCategorySlug: subcategories,
        vendorId: vendorId || undefined,
        NOT: {
          id: productId || undefined,
        },
      },
      include: {
        vendor: true,
        specifications: true,
        variants: true,
        newArrivalDiscount: true,
        productDiscount: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in recommended products route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
