import * as jose from "jose";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(customer.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("1MP-Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    const responseData = {
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        image: customer.image,
        createdAt: customer.createdAt,
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
