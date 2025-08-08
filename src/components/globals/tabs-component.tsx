"use client";

import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface TabItemType<T extends string> {
  index: number;
  label: string;
  value: T;
  showSeparatorBefore?: boolean;
}

interface TabsComponentProps<T extends string> {
  activeTab: T;
  setActiveTab: (value: T) => void;
  items: TabItemType<T>[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
}

const TabsComponent = <T extends string>({
  activeTab,
  setActiveTab,
  items,
  // The main container now uses a responsive flex layout
  className = "flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-5 mb-5",
  itemClassName = "w-full lg:w-auto flex flex-row gap-2 items-center border-b-2 border-transparent hover:border-primary pb-2 lg:pb-1 cursor-pointer",
  activeItemClassName = "border-primary hover:border-primary",
  separatorClassName = "h-4 w-px bg-gray-300 mx-2 hidden lg:block", // Hide separator on mobile
}: TabsComponentProps<T>) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <TabItem
          key={item.index}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          itemClassName={itemClassName}
          activeItemClassName={activeItemClassName}
          separatorClassName={separatorClassName}
        />
      ))}
    </div>
  );
};

interface TabItemProps<T extends string> {
  item: TabItemType<T>;
  activeTab: T;
  setActiveTab: (value: T) => void;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
}

const TabItem = <T extends string>({
  item,
  activeTab,
  setActiveTab,
  itemClassName,
  activeItemClassName,
  separatorClassName,
}: TabItemProps<T>) => {
  const { label, value, showSeparatorBefore } = item;

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = useMemo(() => activeTab === value, [activeTab, value]);

  return (
    <>
      {showSeparatorBefore && (
        <Separator className={separatorClassName} orientation="vertical" />
      )}
      <div
        className={cn(itemClassName, {
          [activeItemClassName || ""]: isActive,
        })}
        onClick={handleClick}
      >
        <h3
          className={cn("font-normal", {
            "text-primary font-bold": isActive,
          })}
        >
          {label}
        </h3>
      </div>
    </>
  );
};

export default TabsComponent;
