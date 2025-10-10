/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import Footer from "@/components/globals/footer";
import Link from "next/link";
import { CategoryWithSubCategories } from "@/types";

const Client = () => {
  const [categories, setCategories] = useState<CategoryWithSubCategories[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Skeleton loader component
  const CategorySkeleton = () => (
    <div className="w-full">
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-5 animate-pulse"></div>
      <div className="space-y-2 flex flex-col mt-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full lg:h-[500px] h-[400px] relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg"
            alt="Sitemap"
            fill
            className="size-full object-cover"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="lg:px-20 px-10 lg:mt-32 mt-20 text-white">
              <div>
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  1 Market Philippines | Sitemap
                </h1>
                <p className="max-w-2xl text-lg mb-6">
                  Explore the structure of 1 Market Philippines. Our sitemap
                  provides a comprehensive overview of all the pages and
                  sections available on our website, making it easy for you to
                  navigate and find what you're looking for.
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className="lg:py-16 py-10 lg:px-20 px-10">
          <h1 className="text-4xl tracking-tighter font-bold">
            Product and Services Categories
          </h1>
          <div className="mt-10 w-full grid md:grid-cols-4 grid-cols-1 gap-x-18 gap-y-14">
            {loading
              ? // Show skeleton loaders while loading
                [...Array(4)].map((_, index) => (
                  <div key={index} className="col-span-1 space-y-12">
                    {[...Array(3)].map((_, i) => (
                      <CategorySkeleton key={i} />
                    ))}
                  </div>
                ))
              : // Show actual content when loaded
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="col-span-1 space-y-12">
                    {categories
                      .slice(
                        index * Math.ceil(categories.length / 4),
                        (index + 1) * Math.ceil(categories.length / 4)
                      )
                      .map((category) => (
                        <div key={category.id} className="w-full">
                          <Link
                            href={`/type/${category.slug}`}
                            className="font-semibold capitalize text-lg mb-5"
                          >
                            {category.name}
                          </Link>
                          <div className="space-y-2 flex flex-col mt-5">
                            {category.subCategories.map((subCategory) => (
                              <Link
                                href={`/category/${subCategory.name}`}
                                key={subCategory.id}
                                className="text-gray-600 capitalize text-sm"
                              >
                                {subCategory.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
