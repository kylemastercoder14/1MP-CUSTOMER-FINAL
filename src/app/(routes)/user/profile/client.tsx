"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditIcon, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { User } from "@prisma/client";

const UserProfileClient = ({ user }: { user: User | null }) => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="relative">
          {/* Avatar: Prioritize DB customer image, then Supabase metadata, then fallback */}
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user?.image as string}
              alt={user?.firstName || "User avatar"}
              className="object-cover"
            />
            <AvatarFallback>
              {getInitials(user?.firstName, user?.lastName) ||
                user?.email ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">
              {/* User Name: Prioritize DB customer name, then Supabase metadata name, then email */}
              {user?.firstName || user?.lastName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : "Guest User"}
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

export default UserProfileClient;
