import React from "react";
import NeedHelp from "@/components/globals/need-help";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <NeedHelp />
    </div>
  );
};

export default HomeLayout;
