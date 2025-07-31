import React, { Suspense } from "react";
import Client from "./client";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <Client />
    </Suspense>
  );
};

export default Page;
