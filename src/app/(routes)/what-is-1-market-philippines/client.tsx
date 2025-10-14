/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { NumberTicker } from "@/components/animated-ui/number-ticker";
import {
  Check,
  X,
  Users,
  MapPinCheck,
  ShoppingBag,
  Heart,
  Target,
  Eye,
  ShieldAlert,
  Brain,
  ScanEye,
  ShieldUser,
  Store,
} from "lucide-react";
import { NewsWithSections } from "@/types";
import Link from "next/link";
import { motion } from 'framer-motion';

const comparisonData = [
  {
    feature: "Delivery Speed",
    oneMarket: "Same-day/Next-day",
    lazada: "2-7 days",
    shopee: "3-7 days",
    advantage: "1MP",
  },
  {
    feature: "Focus Area",
    oneMarket: "Community-based",
    lazada: "National/International",
    shopee: "National/International",
    advantage: "1MP",
  },
  {
    feature: "Seller Competition",
    oneMarket: "Low (Community only)",
    lazada: "Very High",
    shopee: "Very High",
    advantage: "1MP",
  },
  {
    feature: "Personal Connection",
    oneMarket: "Direct with local businesses",
    lazada: "Limited",
    shopee: "Limited",
    advantage: "1MP",
  },
  {
    feature: "Support Local Economy",
    oneMarket: "100% Local businesses",
    lazada: "Mixed (mostly big brands)",
    shopee: "Mixed (mostly big brands)",
    advantage: "1MP",
  },
  {
    feature: "Product Variety",
    oneMarket: "Community-specific",
    lazada: "Extensive",
    shopee: "Extensive",
    advantage: "Others",
  },
  {
    feature: "Brand Recognition",
    oneMarket: "Growing",
    lazada: "Established",
    shopee: "Established",
    advantage: "Others",
  },
  {
    feature: "Shipping Cost",
    oneMarket: "Lower (shorter distance)",
    lazada: "Standard rates",
    shopee: "Standard rates",
    advantage: "1MP",
  },
];

const coreValues = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Community Commitment",
    description:
      "We are dedicated to serving local communities and supporting inclusive economic development through responsible innovation.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Empowerment",
    description:
      "We help small businesses grow by giving them access to broader markets and digital tools that level the playing field.",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Integrity",
    description:
      "We maintain honesty and transparency in all aspects of our business, ensuring ethical practices in every interaction.",
  },
  {
    icon: <ShieldAlert className="w-8 h-8" />,
    title: "Reliability & Responsibility",
    description:
      "Our team is driven by dependability and care — always acting with purpose and accountability for the people we serve.",
  },
];

const strengths = [
  {
    icon: <ScanEye className="lg:size-12 size-7" />,
    title: "Localized Focus",
    description:
      "Unlike most web-based business portals that target the entire country, 1 Market Philippines concentrates on specific local areas — such as cities or municipalities — allowing for deeper community engagement.",
  },
  {
    icon: <MapPinCheck className="lg:size-12 size-7" />,
    title: "Community-Oriented Approach",
    description:
      "By focusing on local communities, 1MP supports small businesses in building stronger customer relationships and establishing a loyal local following.",
  },
  {
    icon: <ShieldUser className="lg:size-12 size-7" />,
    title: "Scalable Model",
    description:
      "While it starts with a small, localized orientation, 1MP is designed to grow — with the ability to scale up to serve a nationwide market.",
  },
  {
    icon: <Store className="lg:size-12 size-7" />,
    title: "Empowering Small Businesses",
    description:
      "The platform breaks traditional limitations of brick-and-mortar setups by offering online exposure and opportunities for growth.",
  },
  {
    icon: <ShoppingBag className="lg:size-12 size-7" />,
    title: "Inclusive Platform",
    description:
      "1MP is accessible to small and micro-businesses that may not have the resources for larger e-commerce platforms, giving them a space to thrive.",
  },
];

const Client = () => {
  const [counts, setCounts] = React.useState({
    products: 0,
    vendors: 0,
    users: 0,
    productCategories: 0,
  });
  const [newsArticles, setNewsArticles] = React.useState<NewsWithSections[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/v1/counts");
        if (!response.ok) {
          throw new Error("Failed to fetch counts");
        }
        const data = await response.json();
        if (data.success) {
          setCounts(data.data);
        } else {
          console.error("Error fetching counts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

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
          console.error("Error fetching news articles:", result.message);
          setNewsArticles([]);
        }
      } catch (err: any) {
        console.error("Error fetching news articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const NewsArticleSkeleton = () => (
    <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm bg-white h-full animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
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
            src="https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg"
            alt="1MP"
            fill
            className="size-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/20"></div>
          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="lg:pl-80 pl-10 lg:mt-32 mt-0 text-black">
              <div className="flex lg:flex-row flex-col-reverse lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl md:text-5xl font-bold lg:mb-4 mb-2 lg:mt-0 mt-5">
                    One community, one market place.
                  </h1>
                  <p className="max-w-lg text-lg lg:mb-6">
                    Easily browse, compare, and contact businesses to get what
                    you need—fast and conveniently. Join us in building a
                    stronger, more connected neighborhood!
                  </p>
                </div>
                <div className="relative lg:size-96 size-40 mt-10 lg:mt-0 lg:ml-40">
                  <Image
                    src="/about.png"
                    alt="About 1MP"
                    fill
                    className="size-full shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="lg:py-20 py-10">
          <div className="lg:px-80 px-10">
            <div
              id="mission-and-vision"
              className="grid lg:grid-cols-5 grid-cols-1 lg:gap-40 gap-10"
            >
              <div className="lg:col-span-3">
                <h1 className="text-black text-5xl tracking-tighter font-bold">
                  What is 1 Market Philippines?
                </h1>
                <h3 className="text-black text-xl font-medium mt-5 leading-snug tracking-tight">
                  1 Market Philippines is a community business portal whose
                  objective is to help small community businesses grow and reach
                  their maximum potential by giving them access to a wider
                  customer reach and eliminating bounderies and limits of a
                  traditional brick and mortar set up.
                </h3>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-10">
                  <div className="border-l-[4px] border-zinc-300 pl-3">
                    <NumberTicker
                      value={counts.products}
                      className="whitespace-pre-wrap text-4xl text-[#800020] font-medium tracking-tighter"
                    />
                    <p className="text-xl text-[#3a190b]">products</p>
                  </div>
                  <div className="border-l-[4px] border-zinc-300 pl-3">
                    <NumberTicker
                      value={counts.vendors}
                      className="whitespace-pre-wrap text-4xl text-[#800020] font-medium tracking-tighter"
                    />
                    <p className="text-xl text-[#3a190b]">businesses</p>
                  </div>
                  <div className="border-l-[4px] border-zinc-300 pl-3">
                    <NumberTicker
                      value={counts.productCategories}
                      className="whitespace-pre-wrap text-4xl text-[#800020] font-medium tracking-tighter"
                    />
                    <p className="text-xl text-[#3a190b]">product categories</p>
                  </div>
                  <div className="border-l-[4px] border-zinc-300 pl-3">
                    <NumberTicker
                      value={counts.users}
                      className="whitespace-pre-wrap text-4xl text-[#800020] font-medium tracking-tighter"
                    />
                    <p className="text-xl text-[#3a190b]">customers</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:mt-20 mt-10 gap-12">
              <div className="bg-gradient-to-br from-[#800020] to-[#3a190b] p-8 rounded-3xl text-white">
                <div className="flex items-center mb-6">
                  <Target className="w-10 h-10 mr-4" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg leading-relaxed opacity-90">
                  1 Market Phillippines empower small and medium enterprises and
                  help them grow their business exponentially bu expanding the
                  territorial reach of their market.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white">
                <div className="flex items-center mb-6">
                  <Eye className="w-10 h-10 mr-4" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg leading-relaxed opacity-90">
                  1 Market Phillippines bring the Philippines to economic super
                  level by encouraging every locality experience an
                  entrepreneurial revolution
                </p>
              </div>
            </div>
            <div className="lg:mt-20 mt-10">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Our Core Values
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {coreValues.map((value, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="text-[#800020] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Our Strengths Section */}
            <div className="lg:mt-20 mt-10">
              <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
                Our Strengths
              </h2>
              <p className="text-center text-gray-600 lg:mb-16 mb-10 max-w-3xl mx-auto">
                Discover what makes 1 Market Philippines uniquely positioned to
                serve local communities and empower small businesses
              </p>
              <div className="space-y-8">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className={`flex lg:flex-row flex-col items-start gap-8 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-[#800020]/5 to-[#3a190b]/5 border-l-4 border-[#800020]"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-4 rounded-xl ${
                        index % 2 === 0
                          ? "bg-[#800020]/10 text-[#800020]"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {strength.icon}
                    </div>
                    <div className={index % 2 === 0 ? "" : ""}>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">
                        {strength.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:mt-20 lg:px-80 px-4 mt-14">
            <h2 className="lg:text-4xl text-2xl font-bold text-center mb-4 text-gray-800">
              1 Market Philippines vs Major e-commerce platforms
            </h2>
            <p className="text-center text-gray-600 mb-8 lg:mb-12 max-w-3xl mx-auto">
              See how our community-focused approach gives us unique advantages
              in serving local businesses and customers
            </p>

            {/* Desktop Table - Visible on large screens */}
            <div className="hidden lg:block overflow-x-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#800020] to-[#3a190b] text-white">
                      <th className="p-6 text-left font-bold text-lg">
                        Features
                      </th>
                      <th className="p-6 text-center font-bold text-lg">
                        1 Market Philippines
                      </th>
                      <th className="p-6 text-center font-bold text-lg">
                        Lazada
                      </th>
                      <th className="p-6 text-center font-bold text-lg">
                        Shopee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-200`}
                      >
                        <td className="p-6 font-semibold text-gray-800">
                          {row.feature}
                        </td>
                        <td
                          className={`p-6 text-center ${row.advantage === "1MP" ? "bg-green-100 text-green-800 font-semibold" : ""}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {row.advantage === "1MP" && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                            <span>{row.oneMarket}</span>
                          </div>
                        </td>
                        <td
                          className={`p-6 text-center ${row.advantage !== "1MP" ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-600"}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {row.advantage !== "1MP" && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                            {row.advantage === "1MP" && (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <span>{row.lazada}</span>
                          </div>
                        </td>
                        <td
                          className={`p-6 text-center ${row.advantage !== "1MP" ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-600"}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {row.advantage !== "1MP" && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                            {row.advantage === "1MP" && (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <span>{row.shopee}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Layout - Visible on small screens */}
            <div className="lg:hidden">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 mb-4 rounded-xl shadow-lg border ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    {row.feature}
                  </h3>

                  {/* 1 Market Philippines */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-colors duration-200 ${row.advantage === "1MP" ? "bg-green-100" : "bg-white"}`}
                  >
                    <span
                      className={`font-semibold ${row.advantage === "1MP" ? "text-green-800" : "text-gray-800"}`}
                    >
                      1 Market Philippines
                    </span>
                    <div className="flex items-center space-x-2">
                      {row.advantage === "1MP" && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                      <span
                        className={`text-sm ${row.advantage === "1MP" ? "text-green-800" : "text-gray-600"}`}
                      >
                        {row.oneMarket}
                      </span>
                    </div>
                  </div>

                  {/* Lazada */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-colors duration-200 ${row.advantage === "Others" ? "bg-blue-100" : "bg-white"}`}
                  >
                    <span
                      className={`font-semibold ${row.advantage === "Others" ? "text-blue-800" : "text-gray-800"}`}
                    >
                      Lazada
                    </span>
                    <div className="flex items-center space-x-2">
                      {row.advantage === "Others" && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                      {row.advantage === "1MP" && (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                      <span
                        className={`text-sm ${row.advantage === "Others" ? "text-blue-800" : "text-gray-600"}`}
                      >
                        {row.lazada}
                      </span>
                    </div>
                  </div>

                  {/* Shopee */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${row.advantage === "Others" ? "bg-blue-100" : "bg-white"}`}
                  >
                    <span
                      className={`font-semibold ${row.advantage === "Others" ? "text-blue-800" : "text-gray-800"}`}
                    >
                      Shopee
                    </span>
                    <div className="flex items-center space-x-2">
                      {row.advantage === "Others" && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                      {row.advantage === "1MP" && (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                      <span
                        className={`text-sm ${row.advantage === "Others" ? "text-blue-800" : "text-gray-600"}`}
                      >
                        {row.shopee}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 italic lg:text-base text-sm px-4">
                * Our community-focused approach provides unique advantages in
                delivery speed, personal connections, and supporting local
                economy
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br lg:mt-20 mt-10 from-gray-50 to-gray-100 lg:p-12 p-8 border border-gray-200">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
              What does 1 Market Philippines mean?
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              1 Market Philippines is more than just a name — it represents a
              mission-driven community business portal that empowers small local
              businesses to grow and thrive. The platform is designed to break
              the boundaries of traditional brick-and-mortar setups by giving
              entrepreneurs access to a wider market. Through 1 Market
              Philippines, small community businesses can showcase their
              products and services to a broader audience, allowing them to
              reach their full potential and create meaningful connections with
              customers nationwide.
            </p>
          </div>
          <div className="lg:mt-20 mt-10 lg:px-80 px-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
              Latest from 1 Market Philippines
            </h2>
            <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                // Show 4 skeleton loaders when loading
                Array.from({ length: 4 }).map((_, index) => (
                  <NewsArticleSkeleton key={index} />
                ))
              ) : newsArticles.length === 0 ? (
                // Show "No news articles found" message when not loading and no articles
                <p className="col-span-full text-gray-500 text-center py-10 text-lg">
                  No news articles found. Please check back later!
                </p>
              ) : (
                // Render actual news articles when not loading and articles exist
                newsArticles.map((news) => (
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
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
