"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  selectedPopularityRanges: string[];
  onPopularityChange: (value: string, isChecked: boolean) => void;
}

const PopularityFilter = ({
  selectedPopularityRanges,
  onPopularityChange,
}: Props) => {
  const popularityOptions = ["10.0", "9.0", "8.0", "7.0", "6.0", "Below5.0"];
  return (
    <div className="flex-col flex space-y-2">
      {popularityOptions.map((option) => (
        <div key={option} className="flex items-center gap-3">
          <Checkbox
            id={option}
            checked={selectedPopularityRanges.includes(option)}
            onCheckedChange={(checked) => {
              onPopularityChange(option, checked as boolean);
            }}
          />
          <Label className="font-normal" htmlFor={option}>
            {option === "Below5.0" ? "Below 5.0" : option}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PopularityFilter;
