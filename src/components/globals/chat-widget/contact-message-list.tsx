/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { CheckCheck, Check, FileText, Loader2 } from "lucide-react";
import { MessageSeenTracker } from "@/components/globals/chat-widget/message-seen-tracker";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProductWithProps } from "@/types";
import { calculateDiscountPrice, getDiscountInfo } from "@/lib/utils";
import { useUserClient } from "@/hooks/use-user-client";

interface MessageListProps {
  messages: any[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const router = useRouter();
  const { loading, user } = useUserClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPriceInfo = (product: ProductWithProps) => {
    const price =
      product.variants.length > 0
        ? Math.min(...product.variants.map((v) => v.price))
        : product.price || 0;

    const discounts = getDiscountInfo(product);
    const hasDiscount = discounts.length > 0;
    const discountPrice = calculateDiscountPrice(price, discounts);

    if (hasDiscount) {
      return {
        displayPrice: (
          <div className="flex flex-col">
            <span className="text-xs line-through text-muted-foreground">
              ₱{price.toLocaleString()}
            </span>
            <span className="text-xs text-primary font-medium">
              ₱{discountPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-green-600">
              {discounts.map((d) => d.value)}% OFF
            </span>
          </div>
        ),
        hasDiscount: true,
      };
    }

    return {
      displayPrice: (
        <span className="text-xs text-primary">₱{price.toLocaleString()}</span>
      ),
      hasDiscount: false,
    };
  };

  // Function to render product content
  const renderProductContent = (message: any) => {
    // If the product data is directly available
    if (message.product) {
      const priceInfo = getPriceInfo(message.product);
      return (
        <div className="p-3 max-w-[300px]">
          <div className="relative h-40 w-full rounded-md overflow-hidden mb-2">
            {message.product.images && message.product.images[0] && (
              <Image
                src={
                  typeof message.product.images[0] === "string"
                    ? message.product.images[0]
                    : message.product.images[0].url
                }
                alt={message.product.name || "Product"}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h3 className="font-medium text-sm">
            {message.product.name || "Product"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {priceInfo.displayPrice}
          </p>
          <Button
            className="mt-2"
            size="sm"
            onClick={() => router.push(`/${message.product.slug}`)}
          >
            Browse Product
          </Button>
          {message.body && <p className="mt-2 text-sm">{message.body}</p>}
        </div>
      );
    }

    // If only productId is available but no product data
    return (
      <div className="p-3 max-w-[300px]">
        <div className="h-40 w-full rounded-md bg-gray-100 flex items-center justify-center mb-2">
          <Loader2 className="size-5 animate-spin text-gray-400" />
        </div>
        <h3 className="font-medium">Product</h3>
        <p className="text-sm text-muted-foreground">
          Loading product details...
        </p>
        {message.body && <p className="mt-2 text-sm">{message.body}</p>}
      </div>
    );
  };

  if (loading) return null;

  return (
    <div className="space-y-2 px-2 overflow-y-auto max-h-[calc(100vh-200px)]">
      {messages.map((message) => {
        const isCurrentUser = message.senderUserId === user?.id;
        const isSeen = !!message.seenAt;
        const seenByCount = message.seenBy?.length || 0;
        const isAutoReply = message.isAutoReply;
        const hasProduct = message.productId || message.product;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div className="relative max-w-[85%]">
              <div
                className={`p-3 rounded-lg shadow-sm ${
                  isCurrentUser ? "bg-[#d7f7ef]" : "bg-gray-100"
                } ${isAutoReply ? "border border-blue-200 bg-blue-50" : ""}`}
              >
                {isAutoReply && !isCurrentUser && (
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    Auto Reply
                  </div>
                )}

                {message.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={message.image}
                    alt="image"
                    className="max-h-40 max-w-full rounded-lg mb-2"
                  />
                )}

                {message.file && (
                  <a
                    href={message.file}
                    target="_blank"
                    className="flex items-center gap-2 mb-1"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-[#9accc0] size-8 rounded-full flex items-center justify-center">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm w-40 truncate">
                        {message.file.split("/").pop()}
                      </div>
                    </div>
                  </a>
                )}

                {message.video && (
                  <div className="relative w-full max-w-md">
                    <video
                      controls
                      className="w-full rounded-lg"
                      playsInline
                      disablePictureInPicture
                    >
                      <source src={message.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {hasProduct && renderProductContent(message)}

                {!hasProduct && message.body && (
                  <div
                    dangerouslySetInnerHTML={{ __html: message.body }}
                    className={`text-sm ${
                      isCurrentUser ? "text-gray-900" : "text-gray-700"
                    } [&_a]:text-burgundy`}
                  />
                )}

                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "h:mm a")}
                  </p>
                  {isCurrentUser &&
                    (isSeen ? (
                      <CheckCheck
                        className={`size-3 ${
                          seenByCount > 1 ? "text-[#26AA99]" : "text-gray-400"
                        }`}
                      />
                    ) : (
                      <Check className="size-3 text-gray-400" />
                    ))}
                </div>
              </div>
              {isCurrentUser && (
                <MessageSeenTracker
                  messageId={message.id}
                  isSeen={isSeen}
                  isCurrentUser={isCurrentUser}
                />
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
