import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required.",
          status: 400,
          error: "MISSING_CREDENTIALS",
        },
        { status: 400 }
      );
    }

    // Check if customer exists in your database
    const customer = await db.user.findUnique({ where: { email } });

    if (!customer) {
      return NextResponse.json({
        message: "Customer not found.",
        status: 404,
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    // Verify password
    if (!customer.password || typeof customer.password !== "string") {
      return NextResponse.json(
        {
          message: "Invalid password.",
          status: 401,
          error: "INVALID_PASSWORD",
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, customer.password);
    if (!passwordValid) {
      return NextResponse.json(
        {
          message: "Invalid password.",
          status: 401,
          error: "INVALID_PASSWORD",
        },
        { status: 401 }
      );
    }

    if (!customer.isEmailVerified) {
      return NextResponse.json(
        {
          message: "Email not verified.",
          status: 403,
          error: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const {
      data: { session },
      error: supabaseError,
    } = await (
      await supabase
    ).auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      return NextResponse.json(
        {
          message: "Failed to sign in with Supabase.",
          status: 500,
          error: "SUPABASE_SIGN_IN_ERROR",
        },
        { status: 500 }
      );
    }

    const responseData = {
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        image: customer.image,
        createdAt: customer.createdAt,
      },
      session: {
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        expiresIn: session?.expires_in,
      },
    };

    return NextResponse.json({
      message: "Login successful",
      ...responseData,
      status: 200,
    });
  } catch (error) {
    console.error("Error in sign-in route:", error);
    return NextResponse.json(
      {
        message: "An error occurred during sign-in.",
        status: 500,
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
