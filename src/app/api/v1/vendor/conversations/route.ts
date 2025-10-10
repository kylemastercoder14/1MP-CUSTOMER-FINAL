import { NextResponse } from "next/server";
import { getSellersWithConversations } from "@/hooks/use-get-conversation";
import { useUser } from "@/hooks/use-user";

export async function GET() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = await useUser();

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
