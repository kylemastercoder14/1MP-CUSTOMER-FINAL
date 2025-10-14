export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense } from "react";
import Client from "./client";
import Loading from '@/components/globals/loading';
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  return (
    <Suspense fallback={<Loading />}>
      <Client user={user ?? null} />
    </Suspense>
  );
};

export default Page;
