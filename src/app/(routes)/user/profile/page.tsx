import React from "react";
import UserProfileClient from "./client";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  return <UserProfileClient user={user} />;
};

export default Page;
