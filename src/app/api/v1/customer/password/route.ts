import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, confirmPassword, email } = body;

    // Validate input
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: "Password and confirm password are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists in your User table
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Hash the password for database storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database
    const updatedUser = await db.user.update({
      where: { email: normalizedEmail },
      data: {
        password: hashedPassword,
      },
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(existingUser.id.toString())
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

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
    };

    return NextResponse.json(
      {
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
