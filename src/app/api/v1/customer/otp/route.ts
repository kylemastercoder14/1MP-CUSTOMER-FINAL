import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendOtpEmail } from "@/lib/email-action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return new NextResponse("Email is required.", { status: 400 });
    }

    if (!firstName || !lastName) {
      return new NextResponse("First name and last name are required.", {
        status: 400,
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new NextResponse("Invalid email format.", { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email exists in the User schema
    const existingCustomer = await db.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingCustomer && existingCustomer.isEmailVerified) {
      return new NextResponse("User already registered. Sign in instead?", {
        status: 409,
      });
    }

    // Check if email exists in the Vendor schema
    const existingVendor = await db.vendor.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingVendor) {
      return new NextResponse(
        "This email is already registered as a vendor account. Please use a different email or contact support.",
        { status: 409 }
      );
    }

    // Generate OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP in database
    await db.user.upsert({
      where: { email: normalizedEmail },
      update: {
        otpCode,
        otpExpiresAt,
        firstName,
        lastName,
      },
      create: {
        email: normalizedEmail,
        otpCode,
        otpExpiresAt,
        firstName,
        lastName,
      },
    });

    // Send OTP via Nodemailer
    const response = await sendOtpEmail(normalizedEmail, otpCode);

    if (response.message) {
      return new NextResponse("Failed to send OTP email.", { status: 500 });
    }

    return new NextResponse("OTP sent successfully.", { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
