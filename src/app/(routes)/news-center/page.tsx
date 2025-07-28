/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Header from "@/components/globals/header";
import Image from "next/image";
import Footer from "@/components/globals/footer";
import { NewsWithSections } from "@/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const NewsPage = () => {
  const router = useRouter();
  const [newsArticles, setNewsArticles] = React.useState<NewsWithSections[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    // Fetch active news articles from an API
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/news-articles");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setNewsArticles(result.data);
        } else {
          setError(result.message || "Failed to fetch news articles.");
        }
      } catch (err: any) {
        console.error("Error fetching news articles:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Helper to format date
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm.trim()) {
      router.push(
        `/news-center/search?query=${encodeURIComponent(searchTerm.trim())}`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <section className="px-5 md:px-20 pb-20 pt-40 flex items-center justify-center">
          <Loader2 className="size-4 animate-spin mr-2" />
          <p className="text-gray-600">Loading news articles...</p>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <section className="px-5 md:px-20 pb-20 pt-36 flex items-center justify-center">
          <p className="text-red-600">Error: {error}</p>
        </section>
        <Footer />
      </div>
    );
  }

  // Filter for active news and sort by createdAt descending
  const activeNews = newsArticles
    .filter((news) => news.status === "Active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const latestPost = activeNews[0];
  const otherLatestPosts = activeNews.slice(1, 5);

  // Group news by category
  const newsByCategory: { [key: string]: NewsWithSections[] } = {};
  //   const processedArticleIds = new Set([
  //     ...(latestPost ? [latestPost.id] : []),
  //     ...otherLatestPosts.map((n) => n.id),
  //   ]);

  // Iterate over all active news to group them, excluding those already shown in "Latest Posts"
  activeNews.forEach((news) => {
    if (!newsByCategory[news.category]) {
      newsByCategory[news.category] = [];
    }
    if (newsByCategory[news.category].length < 2) {
      newsByCategory[news.category].push(news);
    }
  });

  // Filter out categories that ended up empty
  const categoriesWithPosts = Object.entries(newsByCategory).filter(
    ([, posts]) => posts.length > 0
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <div className="relative flex-grow">
        <Header />
        <section className="px-5 md:px-20 pb-20 pt-36">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">
                1 Market Philippines Reads
              </h2>
              <p className="text-base mt-3 max-w-4xl font-normal text-gray-700">
                Discover the latest news and updates from 1 Market Philippines.
                Stay informed with our curated articles covering various topics
                including business, technology, lifestyle, and more. Our
                platform aims to provide insightful content that keeps you
                connected with the pulse of the nation.
              </p>
            </div>
            {/* Search input and button */}
            <form
              onSubmit={handleSearch}
              className="relative border border-gray-400 rounded-full overflow-hidden mt-6 md:mt-0 w-full md:w-auto flex"
            >
              <input
                type="text"
                className="px-6 py-2 text-gray-800 outline-none w-full md:min-w-[520px] bg-transparent relative z-10 pr-[100px]"
                placeholder="Search for news, articles, or topics"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute z-10 right-0 top-0 bottom-0 bg-[#800020] rounded-tr-full rounded-br-full hover:bg-[#800020]/80 px-6 py-2 text-white font-semibold flex items-center justify-center cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Latest Posts Section */}
          <h1 className="text-4xl text-[#800020] font-bold tracking-tight mb-8">
            Latest Posts
          </h1>
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Main Latest Post - Left Column */}
            {latestPost ? (
              <div className="lg:col-span-3">
                <Link
                  href={`/news-center/${latestPost.id}`}
                  className="block group h-full"
                >
                  <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={latestPost.thumbnail || "/placeholder.jpg"}
                      alt={latestPost.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white flex flex-col justify-end">
                      <h2 className="text-3xl font-bold mb-2 line-clamp-2 group-hover:underline">
                        {latestPost.title}
                      </h2>
                      <p className="text-sm opacity-90">
                        Admin / {formatDate(latestPost.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="lg:col-span-3 flex items-center justify-center h-[400px] border rounded-xl text-gray-500">
                No latest post available.
              </div>
            )}

            {/* Other Latest Posts - Right Column (4 posts) */}
            <div className="lg:col-span-2 space-y-4">
              {otherLatestPosts.length > 0 ? (
                otherLatestPosts.map((news) => (
                  <Link
                    key={news.id}
                    href={`/news-center/${news.id}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 border rounded-lg overflow-hidden px-2 shadow-sm hover:shadow-md transition-shadow bg-white">
                      <div className="w-[120px] h-[90px] relative flex-shrink-0">
                        <Image
                          src={news.thumbnail || "/placeholder.jpg"}
                          alt={news.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1 py-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                          {news.category.toUpperCase()} |{" "}
                          {news.type.toUpperCase()}
                        </p>
                        <h3 className="text-base font-semibold mb-1 line-clamp-2 group-hover:underline">
                          {news.title}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          Admin / {formatDate(news.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center h-[calc(400px_-_3*16px_-_3*90px)] border rounded-xl text-gray-500">
                  No other latest posts.
                </div>
              )}
            </div>
          </div>

          {/* Posts by Category Section */}
          <div className="mt-20">
            {categoriesWithPosts.length > 0 ? (
              categoriesWithPosts.map(([category, posts]) => (
                <div key={category} className="mb-12">
                  <h2 className="text-3xl font-bold tracking-tight mb-6 capitalize text-[#800020]">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((news) => (
                      <Link
                        key={news.id}
                        href={`/news-center/${news.id}`}
                        className="block group"
                      >
                        <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full">
                          <div className="w-full h-48 relative overflow-hidden">
                            <Image
                              src={news.thumbnail || "/placeholder.jpg"}
                              alt={news.title}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4 flex-grow flex flex-col">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                              {news.type.toUpperCase()}
                            </p>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:underline">
                              {news.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-auto">
                              Admin /{formatDate(news.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {posts.length === 0 && (
                      <p className="col-span-full text-gray-500 text-center">
                        No posts in this category.
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                No categorized posts available.
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
