import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required." },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: {
        slug,
        adminApprovalStatus: "Approved",
      },
      include: {
        vendor: {
          include: {
            promoCode: true,
            coupon: true,
          },
        },
        specifications: true,
        variants: true,
        newArrivalDiscount: true,
        productDiscount: true,
        subCategory: true,
        category: true,
        nutritionalFacts: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    console.error("Error in product route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
