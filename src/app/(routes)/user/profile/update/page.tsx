export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import UserProfileUpdateClient from "./client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  return <UserProfileUpdateClient user={user ?? null} />;
};

export default Page;
