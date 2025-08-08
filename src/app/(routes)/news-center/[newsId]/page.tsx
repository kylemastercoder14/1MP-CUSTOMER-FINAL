/* eslint-disable @typescript-eslint/no-explicit-any */
// app/news/[newsId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { NewsWithSections } from "@/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";

const NewsDetailPage = () => {
  const params = useParams<{ newsId: string }>();
  const newsId = params.newsId;

  const [newsArticle, setNewsArticle] = React.useState<NewsWithSections | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);

  // Helper to format date (reused from previous component)
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  React.useEffect(() => {
    if (!newsId) {
      setLoading(false);
      setError("News article ID is missing.");
      return;
    }

    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/news-articles/${newsId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setNewsArticle(result.data);
        } else {
          setError(result.message || "Failed to fetch news article.");
        }
      } catch (err: any) {
        console.error("Error fetching news article:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  // Effect for updating active table of contents link on scroll
  React.useEffect(() => {
    if (!newsArticle) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Adjust this margin to fine-tune when a section becomes "active"
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveAnchor(entry.target.id);
        }
      });
    }, observerOptions);

    newsArticle.sections.forEach((section) => {
      const element = document.getElementById(section.anchorId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      newsArticle.sections.forEach((section) => {
        const element = document.getElementById(section.anchorId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [newsArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        <section className="px-5 lg:px-20 lg:pb-20 pb-2 lg:pt-36 pt-20 flex flex-grow items-center justify-center">
          <Loader2 className="size-4 animate-spin mr-2" />
          <p className="text-gray-600">Loading news article...</p>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        <section className="px-5 lg:px-20 lg:pb-20 pb-2 lg:pt-36 pt-20 flex flex-grow items-center justify-center">
          <p className="text-red-600">Error: {error}</p>
        </section>
        <Footer />
      </div>
    );
  }

  if (!newsArticle) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        <section className="px-5 lg:px-20 lg:pb-20 pb-2 lg:pt-36 pt-20 flex flex-grow items-center justify-center">
          <p className="text-gray-500">News article not found.</p>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="relative flex-grow">
        <Header />
        <section className="px-5 lg:px-20 lg:pb-20 pb-2 lg:pt-36 pt-20">
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
                <BreadcrumbPage className='line-clamp-1 truncate w-64'>{newsArticle.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-7 gap-10">
            {/* Main Article Content Area */}
            <article className="lg:col-span-5">
              {/* Thumbnail */}
              <div className="relative w-full h-[350px] lg:h-[450px] rounded-lg overflow-hidden mb-6 shadow-lg">
                <Image
                  src={newsArticle.thumbnail || "/placeholder.jpg"}
                  alt={newsArticle.title}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>

              {/* Article Header */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                {newsArticle.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-gray-600 mb-8">
                <span className="px-3 py-1 bg-gray-300 rounded-full font-semibold">
                  {newsArticle.category}
                </span>
                <span className="px-3 py-1 bg-red-100 rounded-full font-semibold">
                  {newsArticle.type}
                </span>
                <span>
                  Posted on: {formatDate(newsArticle.createdAt)} &nbsp; | &nbsp;
                  By: Admin
                </span>
              </div>

              {/* Sections Content */}
              <div className="prose max-w-none prose-lg">
                {" "}
                {/* 'prose' class from @tailwindcss/typography can style rich text */}
                {newsArticle.sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.anchorId}
                    className="mb-8 pt-3"
                  >
                    {" "}
                    {/* Added pt-8 for scroll-to-anchor padding */}
                    <h2 className="text-2xl font-bold mb-4 pb-2 text-[#800020]">
                      {section.heading}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      className="leading-relaxed space-y-4"
                    />
                  </div>
                ))}
              </div>
            </article>

            {/* Table of Contents / Sidebar */}
            <aside className="lg:col-span-2 lg:block hidden bg-white p-6 rounded-lg shadow-md h-fit sticky top-36">
              {" "}
              {/* sticky + top for fixed sidebar */}
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Table of Contents
              </h3>
              <nav>
                <ul className="space-y-4">
                  {newsArticle.sections.map((section) => (
                    <li key={section.id} className="list-disc ml-5">
                      <a
                        href={`#${section.anchorId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(section.anchorId)
                            ?.scrollIntoView({ behavior: "smooth" });
                          setActiveAnchor(section.anchorId);
                        }}
                        className={`block hover:text-[#800020] transition-colors ${
                          activeAnchor === section.anchorId
                            ? "font-semibold text-[#800020]"
                            : "text-gray-700"
                        }`}
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
