

"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, StarHalf } from "lucide-react";

interface RatingOption {
  value: number;
  label: string;
}

const ratings: RatingOption[] = [
  { value: 5, label: "5.0 and up" },
  { value: 4.5, label: "4.5 and up" },
  { value: 4, label: "4.0 and up" },
  { value: 3.5, label: "3.5 and up" }, // Added 3.5 for demonstration
  { value: 3, label: "3.0 and up" },
  { value: 2.5, label: "2.5 and up" }, // Added 2.5 for demonstration
  { value: 2, label: "2.0 and up" },
  { value: 1.5, label: "1.5 and up" }, // Added 1.5 for demonstration
  { value: 1, label: "1.0 and up" },
];

interface RatingFilterProps {
  selectedRatings: string[]; // State from parent (e.g., ["4.5"])
  onRatingChange: (value: string, isChecked: boolean) => void; // Callback to parent
}

const RatingFilter = ({ selectedRatings, onRatingChange }: RatingFilterProps) => {

  const renderStars = (ratingValue: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5; // Check if there's a half star (0.5 or more)

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Render full star
        stars.push(
          <Star key={i} className="size-4 fill-current text-yellow-500" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Render half star
        stars.push(
          <StarHalf key={i} className="size-4 fill-current text-yellow-500" />
        );
      } else {
        // Render empty star
        stars.push(
          <Star key={i} className="size-4 text-gray-300" /> // No fill-current for empty
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col space-y-2">
      {ratings.map((rating) => (
        <div key={rating.value} className="flex items-center gap-3">
          <Checkbox
            id={`${rating.value}andup`}
            checked={selectedRatings.includes(String(rating.value))}
            onCheckedChange={(checked) => {
              onRatingChange(String(rating.value), checked as boolean);
            }}
          />
          <Label
            className="font-normal flex items-center gap-1"
            htmlFor={`${rating.value}andup`}
          >
            <div className="flex">
              {renderStars(rating.value)} {/* Use the helper function here */}
            </div>
            <span>{rating.label}</span>
          </Label>
        </div>
      ))}
    </div>
  );
};

export default RatingFilter;
