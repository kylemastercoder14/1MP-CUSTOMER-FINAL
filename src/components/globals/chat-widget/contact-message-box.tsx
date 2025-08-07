/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Smile,
  Send,
  ImageIcon,
  SquarePlay,
  ShoppingBag,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  isAllowedFileType,
  isVideoFile,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_SIZE_MB,
} from "@/constants";
import { toast } from "sonner";
import BrowseProductPopover from "@/components/globals/chat-widget/browse-product-popover";
import { ProductWithProps } from "@/types";

const sendMessageApiCall = async (url: string, data: FormData | object) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(url, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API call failed");
  }
  return response.json();
};

const ContactMessageBox = ({
  sellerId,
  onMessageSent,
}: {
  sellerId: string;
  onMessageSent: (message: any) => void;
}) => {
  const [message, setMessage] = React.useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const newMessage =
      message.substring(0, cursorPosition) +
      emojiData.emoji +
      message.substring(cursorPosition);
    setMessage(newMessage);
    setShowEmojiPicker(false);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        cursorPosition + emojiData.emoji.length,
        cursorPosition + emojiData.emoji.length
      );
    }, 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!isAllowedFileType(file)) {
      toast.error(
        "Please upload only document files (PDF, Word, Excel, etc.). Images, audio, and video are not allowed."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Add file size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("sellerId", sellerId);
      formData.append("file", file);

      const res = await sendMessageApiCall("/api/v1/vendor/messages/send-file", formData);
      if (res.success) {
        onMessageSent(res.message);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFile = files[0];

    // Add image size check
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB`);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("sellerId", sellerId);
      formData.append("image", imageFile);

      const res = await sendMessageApiCall("/api/v1/vendor/messages/send-image", formData);
      if (res.success) {
        onMessageSent(res.message);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const videoFile = files[0];

    // Validate file type and size
    if (!isVideoFile(videoFile)) {
      toast.error("Please upload only video files (MP4, WebM, OGG, MOV, AVI)");
      return;
    }

    if (videoFile.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error(
        `Video file is too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB`
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("sellerId", sellerId);
      formData.append("video", videoFile);

      const res = await sendMessageApiCall("/api/v1/vendor/messages/send-video", formData);
      if (res.success) {
        onMessageSent(res.message);
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setIsLoading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const handleProductSelect = async (product: ProductWithProps) => {
    setIsLoading(true);
    try {
      const res = await sendMessageApiCall("/api/v1/vendor/messages/send-product", {
        sellerId,
        productId: product.id,
      });
      if (res.success) {
        onMessageSent(res.message);
      }
    } catch (error: any) {
      console.error("Error sending product:", error);
      toast.error(error.message || "Failed to send product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return;
    setIsLoading(true);
    try {
      const res = await sendMessageApiCall("/api/v1/vendor/messages/send-text", {
        sellerId,
        messageBody: message, // Renamed 'body' to 'messageBody' for clarity
      });
      if (res.success) {
        onMessageSent(res.message);
        setMessage("");
      }
      // Handle auto-reply if it exists in the response
      if (res.autoReply) {
        onMessageSent(res.autoReply);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        ref={textareaRef}
        placeholder="Type a message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="w-full min-h-[40px] max-h-[120px] resize-none"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* File Attachment Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                title="File Attachment"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div>
                <p className="text-sm font-medium">Attach a file</p>
                <p className="text-xs text-muted-foreground">
                  Max size: 5MB (PDF, DOC, XLS, etc.)
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.csv,.json,.xml"
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Image Attachment Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                title="Image Upload"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div>
                <p className="text-sm font-medium">Attach an image</p>
                <p className="text-xs text-muted-foreground">
                  Max size: 5MB (JPG, PNG, etc.)
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <Input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Video Attachment Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                title="Video Upload"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <SquarePlay className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div>
                <p className="text-sm font-medium">Attach a video</p>
                <p className="text-xs text-muted-foreground">
                  Max size: 5MB (MP4, WebM, OGG)
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => videoInputRef.current?.click()}
                >
                  Select Video
                </Button>
                <Input
                  ref={videoInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleVideoUpload}
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Product Attachment Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                title="Send Product"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
              <BrowseProductPopover
                sellerId={sellerId}
                onProductSelect={handleProductSelect}
                disabled={isLoading}
              />
            </PopoverContent>
          </Popover>

          {/* Emoji Picker Popover */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                title="Emoji Picker"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0 border-0">
              <EmojiPicker
                width={300}
                height={350}
                onEmojiClick={handleEmojiClick}
                previewConfig={{ showPreview: false }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={message === "" || isLoading}
          size="sm"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactMessageBox;
