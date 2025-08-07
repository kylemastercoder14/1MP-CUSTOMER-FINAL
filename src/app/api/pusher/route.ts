import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";

// Helper function to get authenticated user (from your previous code)
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

export async function POST(request: Request) {
  const { user, error } = await getAuthUser();

  if (error) {
    return error;
  }

  if (!user) {
    return NextResponse.json(
      { message: "User not authenticated." },
      { status: 401 }
    );
  }

  const body = await request.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id");
  const channel = params.get("channel_name");

  if (!socketId || !channel) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  const data = {
    user_id: user.id,
  };

  try {
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher authorization error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
