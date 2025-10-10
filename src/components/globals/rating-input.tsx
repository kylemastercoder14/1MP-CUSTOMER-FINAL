import React from "react";
import { Star, Star as StarFilled } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const handleClick = (rating: number) => {
    onChange(rating);
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className="text-muted-foreground"
        >
          {value >= star ? (
            <StarFilled className="fill-yellow-700 stroke-yellow-700 size-6" />
          ) : (
            <Star className="size-6" />
          )}
        </button>
      ))}
    </div>
  );
};
