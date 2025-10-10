/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SellerWithLastMessage } from "@/types";
import { format } from "date-fns";
import { useContactSeller } from "@/hooks/use-contact-seller";
import {
  BellIcon,
  BellOffIcon,
  ChevronDown,
  ChevronUp,
  MessageSquareDot,
  PinIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUserClient } from "@/hooks/use-user-client";

interface SellerBoxProps {
  data: SellerWithLastMessage;
  isSelected?: boolean;
  onStatusChange?: () => void;
}

const makeApiCall = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API call failed");
  }
  return response.json();
};

const SellerBox = ({
  data,
  isSelected = false,
  onStatusChange,
}: SellerBoxProps) => {
  const { open } = useContactSeller();
  const { loading, user } = useUserClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localPinned, setLocalPinned] = useState(data.isPinned);
  const [localUnread, setLocalUnread] = useState(data.isUnread);
  const [localMuted, setLocalMuted] = useState(data.isMuted);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalPinned(data.isPinned);
    setLocalUnread(data.isUnread);
    setLocalMuted(data.isMuted);
  }, [data.isPinned, data.isUnread, data.isMuted]);

  const handleClick = () => {
    if (isLoading) return;

    // Mark as read when opening the chat
    if (localUnread) {
      handleMarkAsRead();
    }
    open(data.id);
  };

  const handlePinChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    const newPinStatus = !localPinned;

    try {
      // Optimistically update local state
      setLocalPinned(newPinStatus);

      await makeApiCall("/api/v1/vendor/conversations/pin", {
        conversationId: data.conversationId,
        isPinned: newPinStatus,
      });

      toast.success(newPinStatus ? "Chat pinned" : "Chat unpinned");

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Pin toggle error:", err);
      setLocalPinned(!newPinStatus);
      toast.error("Failed to update pin status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    const newMuteStatus = !localMuted;

    try {
      // Optimistically update local state
      setLocalMuted(newMuteStatus);

      await makeApiCall("/api/v1/vendor/conversations/mute", {
        conversationId: data.conversationId,
        isMuted: newMuteStatus,
      });
      toast.success(newMuteStatus ? "Chat muted" : "Chat unmuted");

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Mute toggle error:", err);
      setLocalMuted(!newMuteStatus);
      toast.error("Failed to update mute status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!localUnread || isLoading) return;

    setIsLoading(true);

    try {
      // Optimistically update local state
      setLocalUnread(false);

      await makeApiCall("/api/v1/vendor/conversations/read", {
        conversationId: data.conversationId,
        isUnread: false,
      });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Mark as read error:", err);
      setLocalUnread(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsUnread = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localUnread || isLoading) return;

    setIsLoading(true);

    try {
      // Optimistically update local state
      setLocalUnread(true);

      await makeApiCall("/api/v1/vendor/conversations/read", {
        conversationId: data.conversationId,
        isUnread: true,
      });
      toast.success("Marked as unread");

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Mark as unread error:", err);
      setLocalUnread(false);
      toast.error("Failed to mark as unread");
    } finally {
      setIsLoading(false);
    }
  };

  const getMessagePreview = () => {
    if (!data.lastMessage) return "No messages yet";

    const isCurrentUser = data.lastMessage.senderUserId === currentUserId;
    const senderName = isCurrentUser ? "You" : data.name || "Seller";

    if (data.lastMessage.image) {
      return `${senderName} sent an image`;
    }

    if (data.lastMessage.file) {
      return `${senderName} sent a file`;
    }

    if (data.lastMessage.video) {
      return `${senderName} sent a video`;
    }

    if (data.lastMessage.productId) {
      return `${senderName} sent a product`;
    }

    if (data.lastMessage.body) {
      const plainText = data.lastMessage.body.replace(/<[^>]*>?/gm, "");
      return plainText.length > 30
        ? `${plainText.substring(0, 30)}...`
        : plainText;
    }

    return "New message";
  };

  if (loading) return null;

  const currentUserId = user?.id;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full mt-1 relative flex group items-center space-x-2 px-2 py-3 hover:bg-muted transition cursor-pointer rounded-md",
        isSelected ? "bg-muted" : "bg-white",
        localUnread && !localMuted && "bg-blue-50 hover:bg-blue-100",
        localPinned && "border-l-4 border-yellow-400",
        localMuted && "bg-gray-50 hover:bg-gray-100",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage
            src={data.image as string}
            className={cn(localMuted && "opacity-60", "object-cover")}
          />
          <AvatarFallback
            className={cn(
              "bg-gray-200 text-gray-700",
              localMuted && "bg-gray-300 text-gray-500"
            )}
          >
            {data.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {localUnread && !localMuted && (
          <div className="absolute -top-1 -right-1 size-4 bg-blue-500 rounded-full border-2 border-white" />
        )}
        {localMuted && (
          <div className="absolute -top-1 -right-1 size-4 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
            <BellOffIcon className="size-2.5 text-white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <p
                className={cn(
                  "text-sm font-medium truncate max-w-[90px]",
                  isSelected ? "text-gray-900" : "text-gray-700",
                  localUnread && !localMuted && "font-bold text-gray-900",
                  localMuted && "text-gray-500"
                )}
              >
                {data.name}
              </p>
              {localPinned && (
                <PinIcon
                  className={cn(
                    "size-3.5 rotate-45",
                    localMuted ? "text-gray-400" : "text-yellow-500"
                  )}
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              {data.lastMessage && (
                <span
                  className={cn(
                    "text-[10px]",
                    localUnread && !localMuted
                      ? "text-blue-600 font-medium"
                      : "text-muted-foreground",
                    localMuted && "text-gray-400"
                  )}
                >
                  {format(new Date(data.lastMessage.createdAt), "p")}
                </span>
              )}
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-1"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isLoading}
                  >
                    {isDropdownOpen ? (
                      <ChevronUp
                        className={cn(
                          "size-4",
                          localMuted ? "text-gray-400" : "text-muted-foreground"
                        )}
                      />
                    ) : (
                      <ChevronDown
                        className={cn(
                          "size-4",
                          localMuted ? "text-gray-400" : "text-muted-foreground"
                        )}
                      />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                      localUnread ? handleMarkAsRead() : handleMarkAsUnread(e);
                    }}
                    disabled={isLoading}
                  >
                    <MessageSquareDot className="size-4 mr-2" />
                    {localUnread ? "Mark as read" : "Mark as unread"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePinChat}
                    disabled={isLoading}
                  >
                    <PinIcon className="size-4 mr-2" />
                    {localPinned ? "Unpin chat" : "Pin chat"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleToggleMute}
                    disabled={isLoading}
                  >
                    {localMuted ? (
                      <>
                        <BellIcon className="size-4 mr-2" />
                        Unmute chat
                      </>
                    ) : (
                      <>
                        <BellOffIcon className="size-4 mr-2" />
                        Mute chat
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isLoading}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p
            className={cn(
              "text-xs truncate line-clamp-1 pr-2",
              localUnread && !localMuted
                ? "text-gray-900 font-medium"
                : "text-muted-foreground",
              localMuted && "text-gray-400"
            )}
          >
            {getMessagePreview()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerBox;
