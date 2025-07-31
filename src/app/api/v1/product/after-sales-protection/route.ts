import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const response = await db.product.findMany({
      where: {
        onSiteServiceGuarantee: true,
        freeReplacementParts: true,
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
        { error: "No products available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: response });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
