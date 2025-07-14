import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("X-Real-IP") ||
      "unknown";

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required." },
        { status: 400 }
      );
    }

    // First find the product outside transaction to minimize transaction duration
    const product = await db.product.findUnique({
      where: {
        slug,
        adminApprovalStatus: "Approved",
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Then perform the view tracking in a separate transaction
    try {
      await db.$transaction(async (tx) => {
        const existingView = await tx.productView.findUnique({
          where: {
            productId_ipAddress: {
              productId: product.id,
              ipAddress: ipAddress,
            },
          },
        });

        if (!existingView) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              popularityScore: {
                increment: 1,
              },
            },
          });

          await tx.productView.create({
            data: {
              productId: product.id,
              ipAddress: ipAddress,
            },
          });
        }
      });
    } catch (txError) {
      console.error("Transaction error:", txError);
      // Continue even if view tracking fails
    }

    // Finally fetch the full product data
    const fullProduct = await db.product.findUnique({
      where: { slug },
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

    return NextResponse.json({
      success: true,
      data: fullProduct,
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
