import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Policy type is required." },
        { status: 400 }
      );
    }

    const formattedType = type
      .replace(/\s+(.)?/g, (match, p1) => (p1 ? p1.toUpperCase() : ""))
      .replace(/^./, (match) => match.toLowerCase());

    const policy = await db.policies.findFirst({
      select: {
        [formattedType]: true,
        updatedAt: true,
      },
    });

    if (!policy || !policy[formattedType as keyof typeof policy]) {
      return NextResponse.json(
        { error: `Policy content for "${type}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        content: policy[formattedType as keyof typeof policy],
        updatedAt: policy.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in policies route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
