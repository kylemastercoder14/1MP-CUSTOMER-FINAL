import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Fetch top 5 most popular products
    const products = await db.product.findMany({
      where: {
        adminApprovalStatus: "Approved",
        vendor: {
          adminApproval: "Approved",
        },
      },
      orderBy: {
        popularityScore: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        price: true,
        popularityScore: true,
        averageRating: true,
      },
    });

    if (!products.length)
      return NextResponse.json({ success: true, products: [] });

    const scores = products.map((p) => p.popularityScore);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const productsWithNormalizedScore = products.map((p) => {
      const normalizedScore =
        maxScore === minScore
          ? 5.0 // if all scores are equal, just show max
          : 1 + ((p.popularityScore - minScore) * 4) / (maxScore - minScore);

      return {
        ...p,
        normalizedScore: Number(normalizedScore.toFixed(1)),
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithNormalizedScore,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch popular products" },
      { status: 500 }
    );
  }
}
