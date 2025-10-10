import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Check if the user already liked this product
    const existingLike = await db.like.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    let newLikeStatus: boolean;

    if (existingLike) {
      // If a like exists, delete it (unlike)
      await db.like.delete({
        where: { id: existingLike.id },
      });
      newLikeStatus = false;
    } else {
      // If no like exists, create one (like)
      await db.like.create({
        data: {
          userId: user.id,
          productId: productId,
        },
      });
      newLikeStatus = true;
    }

    // You might also want to return the updated like count for the product
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        _count: {
          select: { like: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        isLiked: newLikeStatus,
        likeCount: product?._count.like || 0,
        message: newLikeStatus ? "Product liked!" : "Product unliked.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking/unliking product:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}
