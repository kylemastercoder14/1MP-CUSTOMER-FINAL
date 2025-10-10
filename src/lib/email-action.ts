"use server";

import { OtpVerificationHTML } from "@/components/email-template/otp-verification";
import { sendMail } from "./email";

export const sendOtpEmail = async (email: string, otpCode: string) => {
  try {
    const htmlContent = await OtpVerificationHTML({
      otpCode,
      userEmail: email,
    });

    await sendMail(
      email,
      `Verify your email address`,
      `Your OTP code is ${otpCode}`,
      htmlContent
    );

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};
