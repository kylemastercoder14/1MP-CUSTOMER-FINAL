import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { VisitorTracker } from "@/components/globals/visitor-tracker";
import "./globals.css";

const geistKarla = Karla({
  variable: "--font-geist-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1 Market Philippines - One community, one market place.",
  description:
    "1 Market Philippines - Your one online place to find all businesses in your neighborhood - one community, one market place.",
  icons: {
    icon: "/images/logo-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistKarla.variable} font-karla antialiased`}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
        <VisitorTracker />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
