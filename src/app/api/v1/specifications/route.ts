import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const specifications = await db.specification.findMany({
      include: {
        product: {
          include: {
            category: true,
            subCategory: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Specifications fetched successfully.",
      data: specifications,
    });
  } catch (error) {
    console.error("Error fetching specifications:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch specifications.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
