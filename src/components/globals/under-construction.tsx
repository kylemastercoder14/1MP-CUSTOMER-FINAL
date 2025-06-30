import Image from "next/image";
import React from "react";

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-40 text-center">
      <Image
        src="/maintenance.png"
        alt="Under Construction"
        width={200}
        height={200}
        className="mb-6"
      />
      <p className="font-semibold text-2xl text-gray-800 mb-2">
        Page Under Construction
      </p>
      <p className="text-gray-600">
        We&apos;re working hard to bring you this feature. Please check back
        soon.
      </p>
    </div>
  );
};

export default UnderConstruction;
