import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";

async function getAuthUser() {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await (await supabase).auth.getSession();

  if (sessionError || !session) {
    return {
      error: NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      ),
    };
  }

  const supabaseUserId = session.user.id;
  const user = await db.user.findUnique({
    where: { authId: supabaseUserId },
    select: { id: true },
  });

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      ),
    };
  }

  return { user };
}

// GET route to fetch the user's invoice info
export async function GET(request: Request) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const followedStores = await db.followStore.findMany({
      where: { userId: user.id },
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
