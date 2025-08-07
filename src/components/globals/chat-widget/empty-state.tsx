import Image from "next/image";
import React from "react";

const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100">
      <div className="text-center items-center flex flex-col">
        <Image src="/chat.svg" alt="Chat" width={150} height={150} />
        <h3 className="mt-3 font-semibold text-gray-900">
          Welcome to 1 Market Philippines Chat
        </h3>
        <p className="text-sm mt-2 text-muted-foreground">
          Start a conversation with a seller by clicking on the chat icon in the
          product listing.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
