"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { PasswordRequirements } from "@/types";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { checkPasswordRequirements } from "@/lib/utils";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// Define separate schemas for each step
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const otpSchema = z.object({
  otpCode: z.string().min(6, "OTP must be 6 digits").max(6),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Page = () => {
  const router = useRouter();
  const [step, setStep] = React.useState<"email" | "otp" | "password">("email");
  const [showPassword, setShowPassword] = React.useState(false);
  const [resendCountdown, setResendCountdown] = React.useState(0);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [ipAddress, setIpAddress] = React.useState<string | null>(null);
  const [resendTimer, setResendTimer] = React.useState<NodeJS.Timeout | null>(
    null
  );
  const [passwordRequirements, setPasswordRequirements] =
    React.useState<PasswordRequirements>({
      hasNumber: false,
      hasLetter: false,
      hasSpecialChar: false,
      isValidLength: false,
    });

  // Check if user has previously verified CAPTCHA
  React.useEffect(() => {
    // First, try to get the IP address
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);

        // Check localStorage for verified IPs
        const verifiedIps = JSON.parse(
          localStorage.getItem("verifiedIps") || "[]"
        );
        if (!verifiedIps.includes(data.ip)) {
          setShowCaptcha(true);
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
        // If we can't get IP, show CAPTCHA to be safe
        setShowCaptcha(true);
      }
    };

    fetchIp();
  }, []);

  // Create separate forms for each step
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    mode: "onChange",
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { isSubmitting: isEmailLoading } = emailForm.formState;
  const { isSubmitting: isOtpLoading } = otpForm.formState;
  const { isSubmitting: isPasswordLoading } = passwordForm.formState;

  const handleSendOtp: SubmitHandler<z.infer<typeof emailSchema>> = async (
    data
  ) => {
    // If CAPTCHA is required but not verified
    if (showCaptcha && !captchaToken) {
      toast.error("Please complete the CAPTCHA verification.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/customer/otp",
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        // If CAPTCHA was shown and verified, store the IP
        if (showCaptcha && ipAddress) {
          const verifiedIps = JSON.parse(
            localStorage.getItem("verifiedIps") || "[]"
          );
          if (!verifiedIps.includes(ipAddress)) {
            localStorage.setItem(
              "verifiedIps",
              JSON.stringify([...verifiedIps, ipAddress])
            );
          }
        }

        // Show success message from backend or default message
        const successMessage =
          response.data?.message || response.data || "OTP sent to your email";
        toast.success(successMessage);
        setStep("otp");

        // Start 60-second countdown
        setResendCountdown(60);
        if (resendTimer) clearInterval(resendTimer);
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setResendTimer(timer);
      } else {
        // Handle unexpected successful responses with error messages
        const errorMessage =
          response.data?.message ||
          response.data ||
          "Failed to send OTP. Please try again later.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      let errorMessage = "Failed to send OTP. Please try again.";

      if (err instanceof AxiosError && err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        // Extract error message from various possible response formats
        const backendMessage =
          responseData?.error || responseData?.message || responseData || null;

        switch (status) {
          case 400:
            // Bad request - validation errors
            errorMessage =
              backendMessage || "Please check your input and try again.";
            break;
          case 409:
            // Conflict - email already exists
            errorMessage =
              backendMessage || "Email already exists. Please sign in instead.";
            break;
          case 500:
            // Server error
            errorMessage =
              backendMessage || "Server error. Please try again later.";
            break;
          default:
            // Other errors
            errorMessage =
              backendMessage || `Error: ${status}. Please try again.`;
        }
      } else if (err instanceof AxiosError && err.code === "NETWORK_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err instanceof AxiosError && err.message) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleVerifyOtp: SubmitHandler<z.infer<typeof otpSchema>> = async (
    data
  ) => {
    try {
      const response = await axios.post(
        "/api/v1/customer/verify-otp",
        { otp: data.otpCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message || "Email verified successfully");
        setStep("password");
      } else {
        toast.error(
          response.data.error || "Failed to verify OTP. Please try again."
        );
      }
    } catch (err) {
      console.error("Error verifying otp code", err);
      let errorMessage = "Failed to verify OTP. Please try again.";

      if (err instanceof AxiosError) {
        // Check both possible error locations
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleCreateAccount: SubmitHandler<
    z.infer<typeof passwordSchema>
  > = async (data) => {
    try {
      const response = await axios.post(
        "/api/v1/customer/password",
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
          email: emailForm.getValues("email"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Successful response (2xx status)
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message || "Password set successfully");

        // Redirect regardless of any other conditions
        router.push("/");

        // Optional: You might want to return here to prevent any further execution
        return;
      }

      // Handle non-successful but non-error responses (3xx, etc.)
      toast.error(
        response.data.message || "Unexpected response. Please try again."
      );
    } catch (err) {
      console.error("Error creating account", err);
      let errorMessage = "Failed to set password. Please try again.";

      if (err instanceof AxiosError) {
        // Check if this is a successful response with an error in the body
        if (
          err.response &&
          typeof err.response.status === "number" &&
          err.response.status >= 200 &&
          err.response.status < 300
        ) {
          // The request technically succeeded, but there might be a message in the response
          toast.success(
            err.response?.data?.message || "Password set successfully"
          );
          router.push("/");
          return;
        }

        // Handle actual errors
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  React.useEffect(() => {
    return () => {
      if (resendTimer) clearInterval(resendTimer);
    };
  }, [resendTimer]);

  return (
    <div className="flex flex-col items-center w-full justify-center m-auto h-screen">
      <Image
        src="/images/logo-dark.png"
        alt="Auth Banner"
        width={60}
        height={60}
        priority
      />
      <h3 className="text-3xl font-bold mt-5">
        {step === "email"
          ? "Sign Up"
          : step === "otp"
            ? "Verify Email"
            : "Create Password"}
      </h3>
      <div className="flex gap-2 items-center justify-center text-sm mt-4">
        <span className="text-muted-foreground">
          Already have 1 Market Philippines account?
        </span>
        <Link href="/sign-in" className="underline font-semibold">
          Sign in
        </Link>
      </div>
      {step === "email" && (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(handleSendOtp)}
            className="mt-5 max-w-md flex flex-col mx-auto w-full space-y-6"
          >
            <div className="grid lg:grid-cols-2 grid-cols-1 mb-4 gap-4">
              <FormField
                control={emailForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="w-full h-12 placeholder:text-base text-base"
                          disabled={isEmailLoading}
                          placeholder="First name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="w-full h-12 placeholder:text-base text-base"
                          disabled={isEmailLoading}
                          placeholder="Last name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="w-full h-12 placeholder:text-base text-base"
                        disabled={isEmailLoading}
                        placeholder="Email address"
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isEmailLoading}
              size="lg"
              type="submit"
              className="text-base"
            >
              {isEmailLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Continue
                </>
              ) : (
                "Continue"
              )}
            </Button>
            {showCaptcha && (
              <div className="flex items-center justify-center w-full">
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={(token) => {
                    setCaptchaToken(token);
                    toast.success("CAPTCHA verified successfully!");
                  }}
                />
              </div>
            )}
            <p className="text-sm text-center text-muted-foreground">
              By continuing, you agree to 1 Market Philippines&apos;s{" "}
              <span className="text-[#800020] underline">Terms of Use</span> and{" "}
              <span className="text-[#800020] underline">
                Privacy Policy Notice
              </span>
              .
            </p>
          </form>
        </Form>
      )}
      {step === "otp" && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="mt-5 max-w-md flex flex-col mx-auto w-full space-y-6"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Please enter the 6-digit OTP sent to your email address.
            </p>
            <FormField
              control={otpForm.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-15" />
                        <InputOTPSlot index={1} className="size-15" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} className="size-15" />
                        <InputOTPSlot index={3} className="size-15" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} className="size-15" />
                        <InputOTPSlot index={5} className="size-15" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-gray-500">
              Didn&apos;t receive code?{" "}
              {resendCountdown > 0 ? (
                <span className="text-gray-400 font-medium">
                  Resend in {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const email = emailForm.getValues("email");
                    if (email)
                      handleSendOtp({
                        email,
                        firstName: emailForm.getValues("firstName"),
                        lastName: emailForm.getValues("lastName"),
                      });
                  }}
                  className="text-primary cursor-pointer font-medium underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
            <Button
              size="lg"
              type="submit"
              disabled={isOtpLoading}
              className="text-base"
            >
              {isOtpLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verify OTP
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        </Form>
      )}
      {step === "password" && (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handleCreateAccount)}
            className="mt-5 max-w-md flex flex-col mx-auto w-full space-y-6"
          >
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="w-full h-12 placeholder:text-base text-base"
                        type={showPassword ? "text" : "password"}
                        disabled={isPasswordLoading}
                        placeholder="Password"
                        {...field}
                        onChange={(e) => {
                          const pwd = e.target.value;
                          field.onChange(e);
                          checkPasswordRequirements(
                            pwd,
                            setPasswordRequirements
                          );
                        }}
                      />
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPasswordLoading}
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        variant="ghost"
                        size="sm"
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeClosed className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="w-full h-12 placeholder:text-base text-base"
                        type="password"
                        disabled={isPasswordLoading}
                        placeholder="Confirm password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-xs text-muted-foreground">
              <p
                className={`${
                  passwordRequirements.hasNumber &&
                  passwordRequirements.hasLetter &&
                  passwordRequirements.hasSpecialChar
                    ? "text-green-600"
                    : passwordRequirements.hasNumber ||
                        passwordRequirements.hasLetter ||
                        passwordRequirements.hasSpecialChar
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                <span>
                  {passwordRequirements.hasNumber &&
                  passwordRequirements.hasLetter &&
                  passwordRequirements.hasSpecialChar
                    ? "✔"
                    : passwordRequirements.hasNumber ||
                        passwordRequirements.hasLetter ||
                        passwordRequirements.hasSpecialChar
                      ? "🗴"
                      : "•"}
                </span>{" "}
                Must contain numbers, letters, and special characters
              </p>
              <p
                className={`${
                  passwordRequirements.isValidLength
                    ? "text-green-600"
                    : passwordRequirements.hasNumber ||
                        passwordRequirements.hasLetter ||
                        passwordRequirements.hasSpecialChar
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                <span>
                  {passwordRequirements.isValidLength
                    ? "✔"
                    : passwordRequirements.hasNumber ||
                        passwordRequirements.hasLetter ||
                        passwordRequirements.hasSpecialChar
                      ? "🗴"
                      : "•"}
                </span>{" "}
                Must be 6-20 characters long
              </p>
            </div>
            <Button
              type="submit"
              className="text-base"
              size="lg"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Page;
