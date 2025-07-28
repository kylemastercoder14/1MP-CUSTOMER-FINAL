/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import Link from "next/link";
import { NewsWithSections } from "@/types";
import { Loader2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [searchResults, setSearchResults] = React.useState<NewsWithSections[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Helper to format date
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        setLoading(false);
        setSearchResults([]); // No query, no results
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/v1/news-articles/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data);
        } else {
          setError(result.message || "Failed to fetch search results.");
        }
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(err.message || "An unexpected error occurred during search.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]); // Re-run effect when search query changes

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="flex-grow relative">
        <section className="px-5 md:px-20 pb-20 pt-36">
          {/* Breadcrumbs for search page */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/news-center">News Center</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  You searched for:{" "}
                  <span className="font-semibold text-gray-900">
                    "{searchQuery}"
                  </span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className="mt-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Search Results for:{" "}
              <span className="text-[#800020]">"{searchQuery}"</span>
            </h1>

            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-5 animate-spin mr-2" />
                <p className="text-gray-600">Searching...</p>
              </div>
            )}

            {error && (
              <div className="text-center text-red-600 py-10">
                Error: {error}
              </div>
            )}

            {!loading && !error && searchResults.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No results found for your search.
              </div>
            )}

            {!loading && !error && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.id}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={news.thumbnail || "/placeholder.jpg"}
                          alt={news.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex-grow flex flex-col">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                          {news.category.toUpperCase()} |{" "}
                          {news.type.toUpperCase()}
                        </p>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:underline">
                          {news.title}
                        </h3>
                        <div className="text-sm text-gray-700 mb-4 line-clamp-3">
                          {/* Attempt to get content from the first section for a brief preview */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                news.sections[0]?.content?.substring(0, 150) +
                                  "..." || "",
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                          <span>By Admin</span>
                          <span>{formatDate(news.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
