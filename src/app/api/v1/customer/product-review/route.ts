import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const { rating, review, images, isAnonymous, productId } =
      await request.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Ensure product exists
    const product = await db.product.findUnique({
      where: { id: productId }, // or slug: productId — depending on your relation
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // ✅ Create product review
    await db.productReview.create({
      data: {
        rating,
        review,
        images,
        isAnonymous,
        userId,
        productId,
      },
    });

    // ✅ Recalculate the average rating
    const allReviews = await db.productReview.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      allReviews.length > 0 ? totalRatings / allReviews.length : 0;

    // ✅ Update product’s average rating
    await db.product.update({
      where: { id: productId },
      data: { averageRating },
    });

    return NextResponse.json({
      success: "Review submitted successfully",
      averageRating,
    });
  } catch (error) {
    console.error("Error during submission:", error);
    return NextResponse.json(
      { error: "An error occurred during review submission" },
      { status: 500 }
    );
  }
}
