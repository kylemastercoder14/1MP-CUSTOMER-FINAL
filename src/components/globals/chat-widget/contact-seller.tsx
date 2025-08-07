/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, CircleAlert, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Vendor } from "@prisma/client";
import EmptyState from "@/components/globals/chat-widget/empty-state";
import ContactMessageBox from "@/components/globals/chat-widget/contact-message-box";
import MessageList from "@/components/globals/chat-widget/contact-message-list";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactSellerProps {
  selectedSellerId: string | null;
  sellerList: Vendor[];
}

interface ConversationData {
  id: string;
  messages: any[];
}

const ContactSeller = ({
  selectedSellerId,
  sellerList,
}: ContactSellerProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectedSeller = sellerList.find(
    (seller) => seller.id === selectedSellerId
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const loadConversation = async () => {
      if (!selectedSellerId) return;

      setLoading(true);
      try {
        // Make API call to get or create conversation
        const response = await fetch(
          `/api/v1/vendor/conversations/get-or-create?sellerId=${selectedSellerId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load conversation");
        }

        const conv: ConversationData = await response.json();
        setMessages(conv?.messages || []);
      } catch (error) {
        console.error("Error loading conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [selectedSellerId]);

  const handleNewMessage = async (newMessage: any) => {
    setMessages((prev) => [...prev, newMessage]);

    // Check if this might trigger an auto-reply
    const isFirstMessage = messages.length === 0;
    if (isFirstMessage && selectedSellerId) {
      // Wait 1-2 seconds for auto-reply
      setTimeout(async () => {
        try {
          // Re-fetch conversation to check for auto-reply
          const response = await fetch(`/api/v1/vendor/conversations/get-or-create?sellerId=${selectedSellerId}`);
          if (!response.ok) {
            throw new Error("Failed to check for auto-reply");
          }
          const conv: ConversationData = await response.json();
          if (conv?.messages?.length > messages.length + 1) {
            setMessages(conv.messages);
          }
        } catch (error) {
          console.error("Error checking for auto-reply:", error);
        }
      }, 1500);
    }
  };

  if (!selectedSeller) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header with seller info - fixed height */}
      <div className="bg-white w-full p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm flex items-center gap-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedSeller?.image || undefined} />
                <AvatarFallback>
                  {selectedSeller?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedSeller?.name}</span>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="px-3 py-5"
            align="start"
          >
            <div className="flex flex-col px-5">
              <div className="flex text-sm items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedSeller?.image || undefined} />
                  <AvatarFallback>
                    {selectedSeller?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedSeller?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedSeller?.email}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex text-xs item-center justify-between">
                  <span>Mute</span>
                  <Switch />
                </div>
                <div className="flex text-xs item-center justify-between">
                  <span>Block User</span>
                  <Switch />
                </div>
                <div className="flex text-xs item-center justify-between">
                  <span>Report</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </div>
              <Separator className="mt-4 mb-4" />
              <div className="flex text-xs item-center justify-between">
                <span>View Profile</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable message content area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          <div className="bg-yellow-200/30 border border-yellow-600 rounded-md w-full p-2">
            <div className="flex items-start gap-2">
              <CircleAlert className="size-10 text-yellow-600" />
              <p className="text-xs">
                Safety tip: Always chat and complete transaction inside 1 Market
                Philippines to protect yourself from scams. Do not share your
                personal information or contact unless it is necessary.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Fixed message input at bottom */}
      {selectedSellerId && (
        <div className="border-t p-4">
          <ContactMessageBox
            sellerId={selectedSellerId}
            onMessageSent={handleNewMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ContactSeller;
