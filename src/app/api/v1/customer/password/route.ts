import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = createClient();

    // Check if user exists in your User table
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if email is already registered in Supabase Auth
    // We'll try to sign in first to check if the auth user exists
    const { data: signInData, error: signInError } = await (
      await supabase
    ).auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    let authUserId = existingUser.authId;

    if (signInError) {
      // If sign in fails, check if it's because of invalid credentials or user doesn't exist
      if (signInError.message.includes("Invalid login credentials")) {
        // User exists in auth but password is wrong - check if they exist in other schema
        const existingVendor = await db.vendor.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingVendor && existingVendor.authId) {
          return NextResponse.json(
            {
              error:
                "This email is already registered as a vendor account. Please use a different email or contact support.",
            },
            { status: 409 }
          );
        }

        // User might exist in auth but not linked properly, try to sign up
        const { data: signUpData, error: signUpError } = await (
          await supabase
        ).auth.signUp({
          email: normalizedEmail,
          password: password,
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            return NextResponse.json(
              {
                error:
                  "This email is already registered. Please use the sign-in option or contact support.",
              },
              { status: 409 }
            );
          }
          return NextResponse.json(
            { error: `Registration error: ${signUpError.message}` },
            { status: 400 }
          );
        }

        if (signUpData.user) {
          authUserId = signUpData.user.id;
        }
      } else {
        // Other sign in errors - user probably doesn't exist in auth, create them
        const { data: signUpData, error: signUpError } = await (
          await supabase
        ).auth.signUp({
          email: normalizedEmail,
          password: password,
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            // Double-check if this email belongs to a vendor
            const existingVendor = await db.vendor.findUnique({
              where: { email: normalizedEmail },
            });

            if (existingVendor) {
              return NextResponse.json(
                {
                  error:
                    "This email is already registered as a vendor account. Please use a different email or contact support.",
                },
                { status: 409 }
              );
            }
          }
          return NextResponse.json(
            { error: `Registration error: ${signUpError.message}` },
            { status: 400 }
          );
        }

        if (signUpData.user) {
          authUserId = signUpData.user.id;
        }
      }
    } else {
      // Sign in was successful, user already exists in auth
      if (signInData.user) {
        authUserId = signInData.user.id;

        // Check if this auth user is linked to a vendor account
        const existingVendor = await db.vendor.findFirst({
          where: { authId: signInData.user.id },
        });

        if (existingVendor) {
          return NextResponse.json(
            {
              error:
                "This email is already registered as a vendor account. Please use a different email or contact support.",
            },
            { status: 409 }
          );
        }
      }
    }

    // Hash the password for database storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database
    const updatedUser = await db.user.update({
      where: { email: normalizedEmail },
      data: {
        authId: authUserId,
        password: hashedPassword,
      },
    });

    // Create a fresh session
    const { data: sessionData, error: sessionError } = await (
      await supabase
    ).auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (sessionError) {
      return NextResponse.json(
        { error: "Failed to create session after registration." },
        { status: 500 }
      );
    }

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
    };

    return NextResponse.json(
      {
        user: userResponse,
        session: {
          accessToken: sessionData.session?.access_token,
          refreshToken: sessionData.session?.refresh_token,
          expiresAt: sessionData.session?.expires_at,
          expiresIn: 60000,
        },
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
