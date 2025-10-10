import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function GET() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const followedStores = await db.followStore.findMany({
      where: { userId },
      include: {
        vendor: {
          include: {
            product: {
              where: {
                adminApprovalStatus: "Approved",
              },
              include: {
                vendor: true,
                category: true,
                subCategory: true,
                variants: true,
                productDiscount: true,
                newArrivalDiscount: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: followedStores },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching followedStores:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching followedStores.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
