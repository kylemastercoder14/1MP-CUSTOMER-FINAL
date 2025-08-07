"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SellerBox from "@/components/globals/chat-widget/seller-box";
import { SellerWithLastMessage } from "@/types";
import { Loader2 } from "lucide-react";

interface ContactSellerSidebarProps {
  selectedSellerId: string | null;
  sellersWithConversations: SellerWithLastMessage[];
}

const ContactSellerSidebar = ({
  selectedSellerId,
  sellersWithConversations: initialSellers,
}: ContactSellerSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sellers, setSellers] = useState(initialSellers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setSellers(initialSellers);
  }, [initialSellers]);

  const handleStatusChange = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Simulate a small delay for the refresh indicator
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Just force a re-render with current data
      setSellers([...sellers]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredSellers = useMemo(() => {
    let result = [...sellers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((seller) =>
        seller.name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    switch (filter) {
      case "Unread":
        result = result.filter((seller) => seller.isUnread);
        break;
      case "Pinned":
        result = result.filter((seller) => seller.isPinned);
        break;
      case "Muted":
        result = result.filter((seller) => seller.isMuted);
        break;
      default:
        break;
    }

    // Sort pinned conversations to the top
    return result.sort((a, b) => {
      // First sort by pinned status (pinned at top)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by unread status (unread at top)
      if (a.isUnread && !b.isUnread) return -1;
      if (!a.isUnread && b.isUnread) return 1;

      // Finally sort by last message date (newest at top)
      const aDate = a.lastMessage?.createdAt || new Date(0);
      const bDate = b.lastMessage?.createdAt || new Date(0);
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [searchTerm, filter, sellers]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b">
        <Input
          placeholder="Search name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
          disabled={isRefreshing}
        />
        <Select
          value={filter}
          onValueChange={setFilter}
          disabled={isRefreshing}
        >
          <SelectTrigger className="w-[90px] border-none shadow-none focus:ring-0">
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SelectValue placeholder="All" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Unread">Unread</SelectItem>
            <SelectItem value="Pinned">Pinned</SelectItem>
            <SelectItem value="Muted">Muted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-y-auto flex-1 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {filteredSellers.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground flex flex-col h-64 items-center justify-center">
            {filter !== "All" ? (
              <>
                No {filter.toLowerCase()} conversations found
                <button
                  onClick={() => setFilter("All")}
                  className="text-blue-500 hover:underline mt-2"
                  disabled={isRefreshing}
                >
                  Show all conversations
                </button>
              </>
            ) : searchTerm ? (
              <>
                No results for &ldquo;{searchTerm}&ldquo;
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-500 hover:underline mt-2"
                  disabled={isRefreshing}
                >
                  Clear search
                </button>
              </>
            ) : (
              "No conversations found"
            )}
          </div>
        ) : (
          filteredSellers.map((chat) => (
            <SellerBox
              key={chat.id}
              data={chat}
              isSelected={selectedSellerId === chat.id}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ContactSellerSidebar;
