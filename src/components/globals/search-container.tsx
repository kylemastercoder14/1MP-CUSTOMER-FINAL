"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Category } from '@prisma/client';

const placeholders = [
  "camping tent for sale",
  "trending shoes for men",
  "dress for wedding",
  "best laptops under 5,000",
  "spanish latte near me",
];

const SearchContainer = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        setIsDropdownOpen(false);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-white rounded-full border border-gray-200 w-full max-w-7xl mx-auto relative"
	  style={{ overflow: 'visible' }}
    >
      {/* Category dropdown */}
      <div className="relative h-full" style={{ overflow: 'visible' }} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between px-4 py-2 text-gray-700 border-r border-gray-200 h-full min-w-[200px] hover:bg-gray-50"
          disabled={categories.length === 0}
        >
          <span className="font-medium truncate">
            {selectedCategory?.name || (categories.length === 0 ? "Loading..." : "Select Category")}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && categories.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-lg z-[1000] max-h-60 overflow-y-auto">
            <div className="py-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
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

      {/* Search input */}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="flex-1 px-6 py-2 text-gray-700 outline-none min-w-[520px] bg-transparent relative z-10"
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
              className="absolute top-1/2 left-6 -translate-y-1/2 pointer-events-none text-gray-500"
            >
              {placeholders[currentPlaceholder]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="bg-[#800020] rounded-tr-full rounded-br-full hover:bg-[#800020]/80 px-6 py-2 text-white font-semibold"
      >
        Search
      </button>
    </form>
  );
};

export default SearchContainer;
