/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Star,
  Wrench,
  Shirt,
  Home,
  Palette,
  EyeClosed,
  HandHeart,
  Camera,
  Notebook,
  Globe,
  PartyPopper,
  Hamburger,
  Cross,
  Sofa,
  Watch,
  PawPrint,
  IdCard,
  Building2,
  Volleyball,
  Cpu,
  BrickWall,
  Car,
  Shapes,
  Utensils,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategoriesDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CategoriesDropdown = ({ isOpen, setIsOpen }: CategoriesDropdownProps) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Icon mapping for categories
  const getIconForCategory = (categoryName: string) => {
    const iconMap: Record<string, any> = {
      "Arts, Crafts & Sewing": Palette,
      Automotive: Wrench,
      "Beauty & Health": EyeClosed,
      "Beauty & Personal Care Services": HandHeart,
      "Creative Services": Camera,
      "Education & Training Services": Notebook,
      "E-Learning": Globe,
      "Event Services": PartyPopper,
      "Fashion & Apparel": Shirt,
      "Food & Beverages": Hamburger,
      "Health & Wellness Services": Cross,
      "Home Services": Home,
      "Home Supplies": Sofa,
      "Jewelry & Accessories": Watch,
      "Pet Supplies": PawPrint,
      "Professional Services": IdCard,
      "Real Estate Services": Building2,
      "Sports & Outdoor": Volleyball,
      "Technology & Programming": Cpu,
      "Tools & Hardwares": BrickWall,
      "Toys & Games": Shapes,
      "Transportation & Logistic Services": Car,
      "Utencils Supplies": Utensils,
    };

    const IconComponent = iconMap[categoryName] || Star;
    return <IconComponent className="size-5" />;
  };

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/v1/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          // Auto-select first category
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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/sub-categories/${selectedCategory.slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        if (data.success) {
          setSubCategories(data.data);
        } else {
          console.error("Error fetching subcategories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  return (
    <div className="relative">
      <button
        className="hover:text-[#800020] cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="size-3" />
        <span>All categories</span>
        <ChevronDown
          className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 px-20 pt-5 pb-10 overflow-hidden right-0 mt-2 w-screen min-h-[700px] bg-white shadow-2xl z-50 border-t border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex">
              {/* Sidebar */}
              <div className="w-96 border-r border-gray-200 p-4 overflow-y-auto h-[700px]">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                        selectedCategory?.id === category.id
                          ? "bg-[#800020] text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {getIconForCategory(category.name)}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-8">
                {selectedCategory && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      {selectedCategory.name}
                    </h2>

                    {loading ? (
                      <div className="grid lg:grid-cols-8 gap-6">
                        {[...Array(16)].map((_, index) => (
                          <div key={index} className="flex flex-col items-center space-y-3">
                            <Skeleton className="w-24 h-24 rounded-full" />
                            <Skeleton className="w-20 h-4 rounded-md" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid lg:grid-cols-8 gap-6">
                        {subCategories.map((subCategory) => (
                          <div
                            key={subCategory.id}
                            className="flex flex-col items-center p-3 rounded-lg cursor-pointer group transition-colors"
                            onClick={() => router.push(`/search-products?categories=${selectedCategory.slug}&subcategories=${subCategory.slug}`)}
                            title={subCategory.name}
                          >
                            <div className="w-24 h-24 bg-gray-100 rounded-full mb-3 flex items-center justify-center transition-colors">
                              {/* Placeholder for product image */}
                              <div className="w-20 h-20 group-hover:scale-105 relative rounded-full">
                                <Image
                                  fill
                                  className="size-full rounded-full"
                                  alt={subCategory.name}
                                  src={subCategory.image || ""}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-center text-gray-700 group-hover:font-medium transition-colors">
                              {subCategory.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesDropdown;
