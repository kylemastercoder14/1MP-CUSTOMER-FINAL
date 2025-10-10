import { NextResponse } from "next/server";
import { useUser } from "@/hooks/use-user";

export async function GET() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = await useUser();

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json(result);
}
