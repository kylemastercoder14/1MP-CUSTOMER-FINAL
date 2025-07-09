import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        subCategories: true,
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
