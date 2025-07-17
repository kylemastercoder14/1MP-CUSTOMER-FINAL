"use client";
import React from "react";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

const NavUser = ({
  isCategoriesOpen,
  isHomepage,
  customer,
  user,
}: {
  isCategoriesOpen: boolean;
  isHomepage?: boolean;
  customer?: {
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    email?: string | null;
  };
  user: { email?: string | null };
}) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } else {
      window.location.href = "/";
    }
  };

  // Determine display name (prioritizes firstName, then lastName, then email prefix, then generic "User")
  const displayName = customer?.firstName || customer?.lastName
    ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
    : user.email?.split("@")[0] || "User";

  // Determine avatar source
  const avatarSrc = customer?.image || undefined;

  // Determine AvatarFallback text
  const avatarFallbackText = getInitials(customer?.firstName, customer?.lastName) ||
                             (user.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`cursor-pointer flex ${isCategoriesOpen || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] items-center gap-2`}
        >
          {avatarSrc ? (
            <Avatar className="w-6 h-6">
              <AvatarImage className='object-cover' src={avatarSrc} alt={displayName} />
              <AvatarFallback>{avatarFallbackText}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-6 h-6 inline-block mr-1" />
          )}
          Hi, {displayName}!
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel className="flex flex-col items-start">
            <span className="font-semibold">{displayName}</span>
            {customer?.email && <span className="text-xs text-muted-foreground">{customer.email}</span>}
            {!customer?.email && user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/user/profile")}>My Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/user/addresses")}>My Address</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/user/purchase")}>Orders</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/user/wishlist")}>Wishlist</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavUser;
