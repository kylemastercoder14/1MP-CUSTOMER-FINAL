import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Search query is required." },
        { status: 400 }
      );
    }

    // Perform a case-insensitive search across title, category, type, and section content
    const newsArticles = await db.news.findMany({
      where: {
        status: "Active",
        OR: [
          {
            title: {
              contains: query, // Search in title
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            category: {
              contains: query, // Search in category
              mode: "insensitive",
            },
          },
          {
            type: {
              contains: query, // Search in type
              mode: "insensitive",
            },
          },
          {
            sections: {
              some: {
                // Search in content of at least one section
                OR: [
                  {
                    heading: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  {
                    content: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: {
        sections: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Search results fetched successfully.",
      data: newsArticles,
    });
  } catch (error) {
    console.error("Error during news search:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform search.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
