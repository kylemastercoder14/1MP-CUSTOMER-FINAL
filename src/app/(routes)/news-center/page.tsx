"use client";

import React, { Suspense } from "react";
import Client from "./client";

export const dynamic = "force-dynamic"; // ⬅ prevents static prerendering

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
};

export default Page;
