"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PriceFilter = () => {
  return (
    <div className="flex items-center gap-2">
      <Input type="number" placeholder="Min" />
      <span>-</span>
      <Input type="number" placeholder="Max" />
      <Button size="icon">
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};

export default PriceFilter;
