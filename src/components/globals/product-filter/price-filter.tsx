"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Props {
  minPrice: number | null;
  maxPrice: number | null;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
}

const PriceFilter = ({ minPrice, maxPrice, onPriceRangeChange }: Props) => {
  const [localMinPrice, setLocalMinPrice] = useState<number | "">(
    minPrice || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<number | "">(
    maxPrice || ""
  );

  const handleApplyFilter = () => {
    const min = localMinPrice === "" ? null : Number(localMinPrice);
    const max = localMaxPrice === "" ? null : Number(localMaxPrice);
    onPriceRangeChange(min, max);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
  };

  // Allow applying filter on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplyFilter();
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="1"
        value={localMinPrice}
        onChange={handleMinChange}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      <span>-</span>
      <Input
        type="number"
        placeholder="1000"
        value={localMaxPrice}
        onChange={handleMaxChange}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      <Button size="icon" onClick={handleApplyFilter}>
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};

export default PriceFilter;
