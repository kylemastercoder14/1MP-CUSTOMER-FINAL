import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;

    const subCategories = await db.subCategory.findMany({
      where: {
        categorySlug: slug,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch sub-categories",
    });
  }
}
