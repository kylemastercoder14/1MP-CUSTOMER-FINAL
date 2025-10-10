"use client";

import React, { useEffect, useRef, useState } from "react";
import { useContactSeller } from "@/hooks/use-contact-seller";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Vendor } from "@prisma/client";
import useRoutes from "@/hooks/use-routes";
import ContactSeller from "@/components/globals/chat-widget/contact-seller";
import AskAi from "@/components/globals/chat-widget/ask-ai";
import Feedback from "@/components/globals/chat-widget/feedback";
import CustomerNavigationItem from "@/components/globals/chat-widget/customer-navigation-item";
import ContactSellerSidebar from "@/components/globals/chat-widget/contact-seller-sidebar";
import { Button } from "@/components/ui/button";
import { IoMdChatbubbles } from "react-icons/io";
import { X } from "lucide-react";
import { SellerWithLastMessage } from "@/types";
import { useUserClient } from '@/hooks/use-user-client';

const NeedHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routes = useRoutes();
  const { sellerId, close } = useContactSeller();
  const { user: customer } = useUserClient();
  const [activeTab, setActiveTab] = useState("Contact Seller");
  const [showWidget, setShowWidget] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [sellerList, setSellerList] = useState<Vendor[]>([]);
  const [sellersWithConversations, setSellersWithConversations] = useState<
    SellerWithLastMessage[]
  >([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("/api/v1/vendor/lists");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setSellerList(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    const fetchSellersWithConversations = async () => {
      try {
        const response = await fetch("/api/v1/vendor/conversations");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors with conversations");
        }
        const data = await response.json();
        setSellersWithConversations(data);
      } catch (error) {
        console.error("Error fetching vendors with conversations:", error);
      }
    };

    fetchSellers();
    fetchSellersWithConversations();
  }, []);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // If there's a sellerId in the URL, open the widget and set the active tab
    if (sellerId) {
      setShowWidget(true);
      setIsOpen(true);
      setActiveTab("Contact Seller");
    } else {
      setShowWidget(true);
    }
  }, [sellerId]);

  const renderContent = () => {
    switch (activeTab) {
      case "Contact Seller":
        return (
          <ContactSeller selectedSellerId={sellerId} sellerList={sellerList} />
        );
      case "Ask AI":
        return (
          <AskAi
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            reload={reload}
            error={error ?? null}
            scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
          />
        );
      case "Feedback":
        return <Feedback userId={customer?.id as string} />;
    }
  };
  return (
    <>
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-2 right-3 z-50"
          >
            <div className="relative rounded-md bg-[#800020] p-1">
              <Button
                onClick={toggleWidget}
                variant="ghost"
                className="bg-transparent hover:bg-transparent text-white hover:text-white"
              >
                <IoMdChatbubbles />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Chat</span>
                  <div className="text-[10px] font-medium tracking-tighter bg-white text-[#800020] px-1 py-0.5 rounded">
                    BETA
                  </div>
                </div>
              </Button>
              <div className="absolute size-6 -top-2 border border-white -right-2 bg-[#800020] text-xs flex items-center justify-center text-white rounded-full">
                3
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            ref={widgetRef}
            className="fixed lg:bottom-0 bottom-36 lg:right-0 right-4 z-50 w-[95%] h-[65vh] lg:w-[800px] shadow-lg border rounded-md bg-white"
          >
            <div className="flex flex-col h-full">
              {/* Header Area */}
              <div className="flex flex-row items-center justify-between px-4 py-2 border-b">
                <div className="flex items-center list-none space-x-2">
                  {routes.map((item) => {
                    return (
                      <CustomerNavigationItem
                        key={item.label}
                        href={"#"}
                        label={item.label}
                        icon={item.icon}
                        active={activeTab === item.label}
                        onClick={() => setActiveTab(item.label)}
                      />
                    );
                  })}
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    close();
                  }}
                  size="sm"
                  variant="ghost"
                  className="px-2 py-0"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </div>
              {/* Main Content Area */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - fixed width and scrollable */}
                {activeTab === "Contact Seller" && (
                  <div className="w-60 border-r overflow-y-auto">
                    <ContactSellerSidebar
                      selectedSellerId={sellerId}
                      sellersWithConversations={sellersWithConversations}
                    />
                  </div>
                )}

                {/* Main Chat Area - scrollable */}
                <main className="flex-1 overflow-y-auto">
                  {renderContent()}
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NeedHelp;
