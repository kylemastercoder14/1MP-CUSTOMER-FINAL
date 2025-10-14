export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense } from "react";
import Client from "./client";
import Loading from '@/components/globals/loading';

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Client />
    </Suspense>
  );
};

export default Page;
