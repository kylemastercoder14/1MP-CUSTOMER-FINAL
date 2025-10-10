import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
      <div className="relative lg:col-span-1 w-full h-screen">
        <Image
          src="/images/auth-banner.png"
          alt="Auth Banner"
          fill
          className="size-full object-cover object-bottom"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40"></div>
      </div>
      <div className="lg:col-span-1 relative">{children}</div>
    </div>
  );
};

export default AuthLayout;
