import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { platform } = await request.json();
    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    // Extract IP address
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      request.headers.get("x-real-ip") || // Nginx
      "unknown";

    if (ip === "unknown") {
      return NextResponse.json(
        { error: "Unable to determine IP" },
        { status: 400 }
      );
    }

    // Find today's record with the same IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await db.pageView.findFirst({
      where: {
        platform,
        createdAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        ip, // Check if the same IP exists
      },
    });

    if (existingRecord) {
      return NextResponse.json({
        success: true,
        message: "IP already tracked",
      });
    } else {
      // Create new record
      await db.pageView.create({
        data: {
          platform,
          count: 1,
          ip,
        },
      });

      return NextResponse.json({ success: true, message: "Visit tracked" });
    }
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
