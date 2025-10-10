export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense } from "react";
import Client from "./client";

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Client />
  </Suspense>
);

export default Page;
