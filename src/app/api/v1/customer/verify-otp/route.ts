import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otp } = body;

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format. It should be a 6-digit number." },
        { status: 400 }
      );
    }

    const existingCustomer = await db.user.findFirst({
      where: {
        otpCode: otp,
        otpExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please generate a new one." },
        { status: 400 }
      );
    }

    const updatedCustomer = await db.user.update({
      where: { id: existingCustomer.id },
      data: {
        isEmailVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully",
        email: updatedCustomer.email,
        customerId: updatedCustomer.id,
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
