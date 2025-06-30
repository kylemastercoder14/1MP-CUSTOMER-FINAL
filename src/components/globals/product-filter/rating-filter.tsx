"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

const ratings = [
  { value: 5, label: "5.0 and up" },
  { value: 4.5, label: "4.5 and up" },
  { value: 4, label: "4.0 and up" },
  { value: 3, label: "3.0 and up" },
  { value: 2, label: "2.0 and up" },
  { value: 1, label: "1.0 and up" },
];

const RatingFilter = () => {
  return (
    <div className="flex flex-col space-y-2">
      {ratings.map((rating) => (
        <div key={rating.value} className="flex items-center gap-3">
          <Checkbox id={`${rating.value}andup`} />
          <Label
            className="font-normal flex items-center gap-1"
            htmlFor={`${rating.value}andup`}
          >
            {/* Render stars */}
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < Math.floor(rating.value)
                      ? "fill-current text-yellow-500"
                      : rating.value % 1 !== 0 && i === Math.floor(rating.value)
                        ? "fill-half text-yellow-500"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>{rating.label}</span>
          </Label>
        </div>
      ))}
    </div>
  );
};

export default RatingFilter;
