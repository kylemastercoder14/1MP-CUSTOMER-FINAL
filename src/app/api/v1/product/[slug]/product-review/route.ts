import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: Request,
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

    const reviews = await db.productReview.findMany({
      where: { productId: product.id },
      include: {
        user: {
          include: {
            address: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute average rating
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        averageRating: Number(avgRating.toFixed(1)),
        totalReviews,
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
