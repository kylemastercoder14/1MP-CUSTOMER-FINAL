"use client";
import { User } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { toast } from 'sonner';

const NavUser = ({
  isCategoriesOpen,
  isHomepage,
  customer,
  user,
}: {
  isCategoriesOpen: boolean;
  isHomepage?: boolean;
  customer?: { firstName?: string; lastName?: string };
  user: { email?: string };
}) => {
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
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`cursor-pointer flex ${isCategoriesOpen || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] items-center gap-2`}
        >
          <User className="w-6 h-6 inline-block mr-1" />
          Hi,{" "}
          {customer?.firstName ||
            customer?.lastName ||
            user.email?.split("@")[0] ||
            "User"}
          !
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>
            {customer?.firstName ||
              customer?.lastName ||
              user.email?.split("@")[0] ||
              "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem>My Address</DropdownMenuItem>
          <DropdownMenuItem>Orders</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavUser;
