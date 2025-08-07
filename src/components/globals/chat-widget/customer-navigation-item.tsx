/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";

const CustomerNavigationItem = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `group flex items-center gap-x-3 rounded-md py-1 px-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default CustomerNavigationItem;
