"use client";

import { useMemo } from "react";
import { cn } from '@/lib/utils';

export interface IItem {
  index: number;
  label: string;
  value: "Products" | "Reviews" | "Policies" | "FAQs";
}

interface TabsProps {
  activeTab: IItem["value"];
  setActiveTab: (value: IItem["value"]) => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const items: IItem[] = [
    {
      index: 0,
      label: "Products",
      value: "Products",
    },
    {
      index: 1,
      label: "Reviews",
      value: "Reviews",
    },
    {
      index: 2,
      label: "Policies",
      value: "Policies",
    },
    {
      index: 3,
      label: "Frequently Asked Questions",
      value: "FAQs",
    },
  ];

  return (
    <div className="flex flex-row px-60 items-center gap-5">
      {items.map((item) => (
        <TabItem
          key={item.index}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
};

const TabItem = ({
  item,
  activeTab,
  setActiveTab,
}: {
  item: IItem;
  activeTab: IItem["value"];
  setActiveTab: (value: IItem["value"]) => void;
}) => {
  const { label, value } = item;

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = useMemo(() => activeTab === value, [activeTab, value]);

  return (
    <>
      <div
        className={cn(
          "flex flex-row gap-2 items-center border-b-2 px-7 border-transparent hover:border-[#800020] pb-2 pt-2 cursor-pointer ",
          {
            "border-[#800020]": isActive,
            "hover:border-[#800020]": isActive,
          }
        )}
        onClick={handleClick}
      >
        <h3
          className={cn("font-normal", {
            "text-[#800020]": isActive,
            "font-bold": isActive,
          })}
        >
          {label}
        </h3>
      </div>
    </>
  );
};

export default Tabs;
