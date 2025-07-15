"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SubCategory } from "@prisma/client";

interface Props {
  visibleSubCategories: SubCategory[];
  subCategories: SubCategory[];
  visibleCount: number;
  categoryLoading: boolean;
  toggleExpand: () => void;
  isExpanded: boolean;
  selectedSubcategories: string[];
  onSubcategoryChange: (slug: string, isChecked: boolean) => void;
}

const CategoryFilter = ({
  visibleSubCategories,
  subCategories,
  visibleCount,
  categoryLoading,
  toggleExpand,
  isExpanded,
  selectedSubcategories,
  onSubcategoryChange,
}: Props) => {
  return (
    <div className="flex flex-col min-h-[30vh] space-y-2 overflow-y-auto">
      {visibleSubCategories.map((subCategory) => (
        <div key={subCategory.id} className="flex items-center gap-3">
          <Checkbox
            id={subCategory.slug}
            checked={selectedSubcategories.includes(subCategory.slug)}
            onCheckedChange={(checked) => {
              onSubcategoryChange(subCategory.slug, checked as boolean);
            }}
          />
          <Label className="font-normal" htmlFor={subCategory.slug}>
            {subCategory.name}
          </Label>
        </div>
      ))}

      {categoryLoading &&
        [...Array(visibleCount)].map(
          (
            _,
            index
          ) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-full h-5 rounded-md" />
            </div>
          )
        )}

      {!categoryLoading && subCategories.length === 0 && (
        <p className="text-muted-foreground text-center">
          No subcategories found.
        </p>
      )}

      {subCategories.length > visibleCount && (
        <Button
          variant="ghost"
          size="sm"
          className="text-[#800020] hover:bg-transparent hover:text-[#800020]"
          onClick={toggleExpand}
        >
          {isExpanded ? "VIEW LESS" : "VIEW MORE"}
        </Button>
      )}
    </div>
  );
};

export default CategoryFilter;
