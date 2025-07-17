"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { EditIcon, Loader2, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getInitials } from '@/lib/utils';

const Page = () => {
  const router = useRouter();
  const { customer, loading, user: supabaseUser, error } = useUser();

  useEffect(() => {
    if (!loading && !supabaseUser) {
      router.push("/sign-in");
    }

    if (!loading && error) {
      console.error("Error in useUser hook, redirecting to sign-in:", error);
      router.push("/sign-in");
    }
  }, [loading, supabaseUser, error, router]);

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center pb-20">
        <Loader2 className="animate-spin h-16 w-16 text-[#800020]" />
      </div>
    );
  }

  if (!supabaseUser) {
    return null;
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="relative">
          {/* Avatar: Prioritize DB customer image, then Supabase metadata, then fallback */}
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={
                customer?.image || supabaseUser?.user_metadata?.avatar_url || ""
              }
              alt={customer?.firstName || supabaseUser?.email || "User avatar"}
              className='object-cover'
            />
            <AvatarFallback>
              {getInitials(customer?.firstName, customer?.lastName) || // From DB customer
                getInitials(
                  supabaseUser?.user_metadata?.first_name,
                  supabaseUser?.user_metadata?.last_name
                ) || // From Supabase metadata
                (supabaseUser?.email
                  ? supabaseUser.email.charAt(0).toUpperCase()
                  : "U")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">
              {/* User Name: Prioritize DB customer name, then Supabase metadata name, then email */}
              {customer?.firstName || customer?.lastName
                ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                : supabaseUser?.user_metadata?.name ||
                  supabaseUser?.email ||
                  "Guest User"}
            </p>
            <EditIcon
              onClick={() => router.push("/user/profile/update")}
              className="w-4 cursor-pointer h-4 text-muted-foreground"
            />
          </div>
          <div className="flex text-center text-sm items-center gap-5">
            <div>
              <p>0</p> {/* Replace with customer.totalReviews if available */}
              <p className="text-xs text-muted-foreground">Total reviews</p>
            </div>
            <p>|</p>
            <div>
              <p>0</p> {/* Replace with customer.totalWishlists if available */}
              <p className="text-xs text-muted-foreground">Total wishlists</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center text-sm mt-5 text-[#0A8800] gap-2">
        <LockKeyhole className="w-4 h-4" />
        <p>
          Your information and privacy will be kept secure and uncompromised.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center h-[30vh]">
        <Image
          src="https://aimg.kwcdn.com/upload_aimg/transaction/ab2196f8-a112-4bea-ac1b-05cb774990bc.png.slim.png"
          width={100}
          height={100}
          alt="Filetext"
        />
        <p className="mt-1 text-black">You don&apos;t have any reviews</p>
        <p className="text-sm text-muted-foreground">
          You have no completed reviews or your reviews have been deleted.
        </p>
        <Button size="sm" className="rounded-full mt-5">
          Go to your reviews
        </Button>
      </div>
    </div>
  );
};

export default Page;
