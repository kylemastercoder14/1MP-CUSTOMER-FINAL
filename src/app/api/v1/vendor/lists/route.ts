import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const vendors = await db.vendor.findMany({
      where: {
        adminApproval: "Approved",
      },
    });

    // Return a successful response with the updated vendors
    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor lists" },
      { status: 500 }
    );
  }
}
