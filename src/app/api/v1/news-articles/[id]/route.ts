import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const newsId = (await params).id;

    if (!newsId) {
      return NextResponse.json(
        { success: false, message: "News ID is required." },
        { status: 400 }
      );
    }

    const newsArticle = await db.news.findUnique({
      where: {
        id: newsId,
        status: "Active",
      },
      include: {
        sections: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!newsArticle) {
      return NextResponse.json(
        { success: false, message: "News article not found or not active." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "News article fetched successfully.",
      data: newsArticle,
    });
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news article.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
