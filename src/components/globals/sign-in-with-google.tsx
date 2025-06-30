"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SignInWithGoogle = () => {
  return (
    <Button
      type="button"
      className="w-full h-12 bg-secondary hover:bg-accent text-black transition-all duration-200 transform hover:scale-[1.02]"
    >
      <Image
        src="/icons/google.png"
        alt="Google Logo"
        width={20}
        height={20}
        className="inline-block mr-2"
      />
      Continue with Google
    </Button>
  );
};

export default SignInWithGoogle;
