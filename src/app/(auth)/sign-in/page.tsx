"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInWithGoogle from "@/components/globals/sign-in-with-google";
import Image from "next/image";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters"),
});

const Page = () => {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [ipAddress, setIpAddress] = React.useState<string | null>(null);

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

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // If CAPTCHA is required but not verified
    if (showCaptcha && !captchaToken) {
      toast.error("Please complete the CAPTCHA verification.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/customer/sign-in",
        {
          email: data.email,
          password: data.password,
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
          response.data?.message || response.data || "Signed in successfully";
        toast.success(successMessage);
        router.push("/");
      } else {
        // Handle unexpected successful responses with error messages
        const errorMessage =
          response.data?.message ||
          response.data ||
          "Failed to sign in. Please try again later.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      let errorMessage = "Failed to sign in. Please try again.";

      if (err instanceof AxiosError && err.code === "NETWORK_ERROR") {
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
  return (
    <div className="flex flex-col items-center w-full justify-center m-auto h-screen">
      <Image
        src="/images/logo-dark.png"
        alt="Auth Banner"
        width={60}
        height={60}
        priority
      />
      <h3 className="text-3xl font-bold mt-5">Sign in</h3>
      <div className="flex gap-2 items-center justify-center text-sm mt-4">
        <span className="text-muted-foreground">
          New to 1 Market Philippines?
        </span>
        <Link href="/sign-up" className="underline font-semibold">
          Create an account
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 max-w-md flex flex-col mx-auto w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative mb-5">
                    <Input
                      className="w-full h-12 placeholder:text-base text-base"
                      disabled={isSubmitting}
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="w-full h-12 placeholder:text-base text-base"
                      type={showPassword ? "text" : "password"}
                      disabled={isSubmitting}
                      placeholder="Password"
                      {...field}
                    />
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
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
          <Link
            href="/forgot-password"
            className="underline mt-3 ml-auto font-semibold text-sm"
          >
            Forgot password?
          </Link>
          <Button
            disabled={isSubmitting}
            size="lg"
            type="submit"
            className="text-base mt-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Continue
              </>
            ) : (
              "Continue"
            )}
          </Button>
          {showCaptcha && (
            <div className="flex items-center mt-5 justify-center w-full">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(token) => {
                  setCaptchaToken(token);
                  toast.success("CAPTCHA verified successfully!");
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-center w-full my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500 font-medium">
              Or, continue with:
            </span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <SignInWithGoogle />
          <p className="text-sm text-center text-muted-foreground mt-5">
            By continuing, you agree to 1 Market Philippines&apos;s{" "}
            <span className="text-[#800020] underline">Terms of Use</span> and{" "}
            <span className="text-[#800020] underline">
              Privacy Policy Notice
            </span>
            .
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Page;
