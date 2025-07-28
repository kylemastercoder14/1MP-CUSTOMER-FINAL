import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const news = await db.news.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sections: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "News articles fetched successfully.",
      data: news,
    });
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news articles.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
