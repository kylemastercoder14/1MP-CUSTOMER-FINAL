import { NextResponse } from "next/server";
import { getSellersWithConversations } from "@/hooks/use-get-conversation";
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

export async function GET(request: Request) {
  try {
    const { user } = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const sellersWithConversations = await getSellersWithConversations(user.id);

    // Return a successful response with the updated vendors
    return NextResponse.json(sellersWithConversations, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor with conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor with conversations" },
      { status: 500 }
    );
  }
}
