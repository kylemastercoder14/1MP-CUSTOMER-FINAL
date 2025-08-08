"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Category } from '@prisma/client';
import { ClockIcon, Search } from 'lucide-react';

const placeholders = [
  "camping tent for sale",
  "trending shoes for men",
  "dress for wedding",
  "best laptops under 5,000",
  "spanish latte near me",
];

// Suggested keywords data
const suggestedKeywords = {
  recent: ["shein clothes wholesale"],
  recommended: [
    "shoes men",
    "women's clothing",
    "shein bales brand new",
    "dresses",
    "dresses women",
    "shoes"
  ]
};

const SearchContainer = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/v1/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setSelectedCategory(data.data[0]);
          }
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholders.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", {
      query: inputValue,
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name
    });
  };

  const handleSearchInputFocus = () => {
    setIsSearchDropdownOpen(true);
  };

  const handleKeywordClick = (keyword: string) => {
    setInputValue(keyword);
    setIsSearchDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 bg-white rounded-full border border-gray-200 relative min-w-0"
      style={{ overflow: 'visible' }}
    >
      {/* Category dropdown */}
      <div className="relative lg:block hidden h-full" style={{ overflow: 'visible' }} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          className="flex items-center justify-between px-4 py-2 text-gray-700 border-r border-gray-200 h-full min-w-[200px] hover:bg-gray-50"
          disabled={categories.length === 0}
        >
          <span className="font-medium truncate">
            {selectedCategory?.name || (categories.length === 0 ? "Loading..." : "Select Category")}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isCategoryDropdownOpen && categories.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-lg z-[1000] max-h-60 overflow-y-auto">
            <div className="py-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                    selectedCategory?.id === category.id ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search input and dropdown */}
      <div className="relative flex-1 min-w-0 lg:text-base text-sm" ref={searchDropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleSearchInputFocus}
          className="w-full h-full lg:py-2 py-1 lg:px-6 px-4 text-gray-700 outline-none bg-transparent relative z-10"
          placeholder=" "
        />

        <AnimatePresence mode="wait">
          {!inputValue && (
            <motion.div
              key={`placeholder-${currentPlaceholder}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 lg:left-6 left-4 -translate-y-1/2 pointer-events-none text-gray-500"
            >
              {placeholders[currentPlaceholder]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search suggestions dropdown */}
        {isSearchDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-lg shadow-lg z-[1000] max-h-96 overflow-y-auto border border-gray-200">
            <div className="py-2">
              {/* Recent searches */}
              {suggestedKeywords.recent.length > 0 && (
                <div className="mb-4">
                  <h3 className="px-4 py-1 text-sm font-medium text-gray-500">Recent searches</h3>
                  <div className="mt-1">
                    {suggestedKeywords.recent.map((keyword, index) => (
                      <button
                        key={`recent-${index}`}
                        type="button"
                        onClick={() => handleKeywordClick(keyword)}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended searches */}
              {suggestedKeywords.recommended.length > 0 && (
                <div>
                  <h3 className="px-4 py-1 text-sm font-medium text-gray-500">Recommended for you</h3>
                  <div className="mt-1">
                    {suggestedKeywords.recommended.map((keyword, index) => (
                      <button
                        key={`recommended-${index}`}
                        type="button"
                        onClick={() => handleKeywordClick(keyword)}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="bg-[#800020] rounded-tr-full rounded-br-full hover:bg-[#800020]/80 lg:px-6 px-4 lg:py-2 py-1 text-white font-semibold"
      >
        Search
      </button>
    </form>
  );
};

export default SearchContainer;
