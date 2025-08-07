"use client";

import React from "react";
import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const StoreCard = ({
  storeName,
  image,
  sold,
  href,
}: {
  storeName: string;
  image: string;
  sold?: number;
  href: string;
}) => {
  const router = useRouter();
  return (
    <CarouselItem
      onClick={() => router.push(href)}
      className="pl-1 basis-full lg:basis-1/9 cursor-pointer"
    >
      <div className="p-1">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Avatar className="size-30">
              <AvatarImage src={image} className="object-cover" />
              <AvatarFallback>{storeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="py-4">
              <p className="line-clamp-2 text-sm">{storeName}</p>
              <p className="text-sm text-muted-foreground">{sold} sold</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
};

export default StoreCard;
