"use client";

import React from "react";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const PopularityFilter = () => {
  return (
    <div className="flex-col flex space-y-2">
      <div className="flex items-center gap-3">
        <Checkbox id="10.0" />
        <Label className="font-normal" htmlFor="10.0">
          10.0
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="9.0" />
        <Label className="font-normal" htmlFor="9.0">
          9.0
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="8.0" />
        <Label className="font-normal" htmlFor="8.0">
          8.0
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="7.0" />
        <Label className="font-normal" htmlFor="7.0">
          7.0
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="6.0" />
        <Label className="font-normal" htmlFor="6.0">
          6.0
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="Below5.0" />
        <Label className="font-normal" htmlFor="Below5.0">
          Below 5.0
        </Label>
      </div>
    </div>
  );
};

export default PopularityFilter;
