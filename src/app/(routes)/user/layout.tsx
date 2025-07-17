"use client";

import React, { useEffect, useMemo } from "react";
import Footer from "@/components/globals/footer";
import Header from "@/components/globals/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { ACCOUNT_LINKS } from "@/constants";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

interface BreadcrumbItemType {
  label: string;
  href: string;
  isCurrent?: boolean;
}

const PATH_SEGMENT_MAP: Record<string, string> = {
  profile: "Profile",
  update: "Update",
  purchase: "Purchases",
  reviews: "Reviews",
  "payment-methods": "Payment Methods",
  vouchers: "My Vouchers",
  "followed-stores": "Followed Stores",
  wishlist: "Wishlist",
  addresses: "Addresses",
  "account-security": "Account Security",
  notifications: "Notifications",
};

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, user: supabaseUser, error } = useUser();

  useEffect(() => {
    if (!loading && !supabaseUser) {
      router.push("/sign-in");
    }

    if (!loading && error) {
      console.error("Error in useUser hook, redirecting to sign-in:", error);
      router.push("/sign-in");
    }
  }, [loading, supabaseUser, error, router]);

  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItemType[] = [{ label: "Home", href: "/" }];

    const pathSegments = pathname.split('/')
                                 .filter(segment => segment !== '' && segment !== 'user');

    let accumulatedPath = "/user";
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      const firstSegmentLabel = PATH_SEGMENT_MAP[firstSegment] ||
                                firstSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const firstSegmentHref = `/user/${firstSegment}`;

      const isFirstSegmentCurrent = pathSegments.length === 1;

      items.push({
        label: firstSegmentLabel,
        href: firstSegmentHref,
        isCurrent: isFirstSegmentCurrent,
      });

      if (pathSegments.length > 1) {
        for (let i = 1; i < pathSegments.length; i++) {
          const segment = pathSegments[i];
          accumulatedPath += `/${segment}`;
          const isLast = i === pathSegments.length - 1;
          const label = PATH_SEGMENT_MAP[segment] ||
                        segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

          items.push({
            label,
            href: accumulatedPath,
            isCurrent: isLast,
          });
        }
      }
    } else if (pathname === '/user' || pathname === '/user/') {
      items.push({
        label: PATH_SEGMENT_MAP['profile'] || 'Profile',
        href: '/user/profile',
        isCurrent: true,
      });
    }

    return items;
  }, [pathname]);


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-[140px] pb-20">
        <Loader2 className="animate-spin h-16 w-16 text-[#800020]" />
      </div>
    );
  }

  if (!supabaseUser) {
    return null;
  }
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <section className="px-20 py-32">
          <Breadcrumb>
            <BreadcrumbList className="text-base">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    {item.isCurrent ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="text-[#800020] hover:text-[#800020]"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid md:grid-cols-12 grid-cols-1 gap-5 mt-5">
            <div className="col-span-2 space-y-3">
              {ACCOUNT_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    className={`text-base ${pathname === link.href || pathname.startsWith(`${link.href}/`) ? "border-l-[4px] bg-[#800020]/10 border-[#800020] hover:bg-[#800020]/10" : "hover:bg-zinc-200"} p-2 flex items-center gap-2 cursor-pointer`}
                    href={link.href}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="col-span-10 bg-white p-5">{children}</div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
