// components/globals/product-filter/specification-filter.tsx

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatAttributeName } from "@/lib/utils";

interface Props {
  specificationsLoading: boolean;
  // UPDATED: groupedSpecifications now holds an array of strings for values
  groupedSpecifications: Record<string, string[]>; // Changed from { id: string; values: string[] }[]
  expandedGroups: Record<string, boolean>;
  toggleGroup: (attribute: string) => void;
  selectedSpecifications: Record<string, string[]>;
  onSpecificationChange: (
    attribute: string,
    value: string,
    isChecked: boolean
  ) => void;
}

const SpecificationFilter = ({
  specificationsLoading,
  groupedSpecifications,
  expandedGroups,
  toggleGroup,
  selectedSpecifications,
  onSpecificationChange,
}: Props) => {
  return (
    <div className="flex flex-col max-h-[30vh] space-y-2 overflow-y-auto">
      {specificationsLoading ? (
        // ... (skeleton loading remains the same)
        [...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 pl-2">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="w-24 h-5 rounded-md" />
              </div>
            ))}
          </div>
        ))
      ) : Object.keys(groupedSpecifications).length > 0 ? (
        Object.entries(groupedSpecifications).map(([attribute, values]) => ( // `values` is now directly `string[]`
          <div key={attribute} className="space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleGroup(attribute)}
            >
              <h4 className="font-medium text-sm">
                {formatAttributeName(attribute)}
              </h4>
              <ChevronDown
                className={`size-4 transition-transform ${
                  expandedGroups[attribute] ? "rotate-180" : ""
                }`}
              />
            </div>
            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedGroups[attribute] === false
                  ? "max-h-0"
                  : "max-h-[500px]"
              }`}
            >
              <div className="space-y-1 pl-2 pt-1">
                {/* Iterate directly over the `values` array */}
                {values.map((value,) => (
                  <div
                    key={`${attribute}-${value}`}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id={`${attribute}-${value}`}
                      value={value}
                      checked={
                        selectedSpecifications[attribute]?.includes(value) ||
                        false
                      }
                      onCheckedChange={(checked) => {
                        onSpecificationChange(
                          attribute,
                          value,
                          checked as boolean
                        );
                      }}
                    />
                    <Label
                      className="font-normal capitalize"
                      htmlFor={`${attribute}-${value}`}
                    >
                      {value.toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-center">
          No specifications found.
        </p>
      )}
    </div>
  );
};

export default SpecificationFilter;
