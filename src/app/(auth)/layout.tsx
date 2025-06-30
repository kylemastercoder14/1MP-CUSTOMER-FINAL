import { QrCode, StoreIcon } from "lucide-react";
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
      <div className="lg:col-span-1 relative">
        <div className="absolute bottom-6 right-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center text-sm text-muted-foreground font-semibold gap-2">
              <StoreIcon className="size-4" />
              Seller Center
            </div>
            <div className="flex items-center text-sm text-muted-foreground font-semibold gap-2">
              <QrCode className="size-4" />
              Continue with QR code
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
