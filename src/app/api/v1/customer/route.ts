/* eslint-disable @typescript-eslint/no-unused-vars */

import { createClient } from "@/lib/supabase/server"; // Server-side Supabase client
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await (await supabase).auth.getSession();

    if (sessionError || !session) {
      console.warn("No active Supabase session found for API request.");
      return NextResponse.json(
        {
          message: "Authentication required.",
          code: "UNAUTHENTICATED",
        },
        { status: 401 }
      );
    }

    // `session.user` contains the Supabase user details
    const supabaseUserId = session.user.id;

    // Fetch customer details from your Prisma database using the Supabase user ID
    const customer = await db.user.findUnique({
      where: { authId: supabaseUserId }, // Assuming 'authId' in your DB `User` model stores Supabase user ID
    });

    if (!customer) {
      console.warn(
        `Customer record not found for Supabase User ID: ${supabaseUserId}`
      );
      return NextResponse.json(
        {
          message: "Customer profile not found in database.",
          code: "CUSTOMER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Return the customer data
    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching customer details.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
