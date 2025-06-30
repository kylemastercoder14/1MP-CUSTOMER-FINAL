"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatAttributeName } from "@/lib/utils";

interface Props {
  specificationsLoading: boolean;
  groupedSpecifications: Record<string, { id: string; values: string[] }[]>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (attribute: string) => void;
}

const SpecificationFilter = ({
  specificationsLoading,
  groupedSpecifications,
  expandedGroups,
  toggleGroup,
}: Props) => {
  return (
    <div className="flex flex-col max-h-[30vh] space-y-2 overflow-y-auto">
      {specificationsLoading ? (
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
        Object.entries(groupedSpecifications).map(([attribute, specs]) => (
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
                {specs.flatMap((spec) =>
                  spec.values.map((value, idx) => (
                    <div
                      key={`${spec.id}-${idx}`}
                      className="flex items-center gap-3"
                    >
                      <Checkbox id={`${spec.id}-${value}`} value={value} />
                      <Label
                        className="font-normal capitalize"
                        htmlFor={`${spec.id}-${value}`}
                      >
                        {value.toLowerCase()}
                      </Label>
                    </div>
                  ))
                )}
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
