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
    icon: <ScanEye className="w-12 h-12" />,
    title: "Localized Focus",
    description:
      "Unlike most web-based business portals that target the entire country, 1 Market Philippines concentrates on specific local areas — such as cities or municipalities — allowing for deeper community engagement.",
  },
  {
    icon: <MapPinCheck className="w-12 h-12" />,
    title: "Community-Oriented Approach",
    description:
      "By focusing on local communities, 1MP supports small businesses in building stronger customer relationships and establishing a loyal local following.",
  },
  {
    icon: <ShieldUser className="w-12 h-12" />,
    title: "Scalable Model",
    description:
      "While it starts with a small, localized orientation, 1MP is designed to grow — with the ability to scale up to serve a nationwide market.",
  },
  {
    icon: <Store className="w-12 h-12" />,
    title: "Empowering Small Businesses",
    description:
      "The platform breaks traditional limitations of brick-and-mortar setups by offering online exposure and opportunities for growth.",
  },
  {
    icon: <ShoppingBag className="w-12 h-12" />,
    title: "Inclusive Platform",
    description:
      "1MP is accessible to small and micro-businesses that may not have the resources for larger e-commerce platforms, giving them a space to thrive.",
  },
];

const Page = () => {
  const [counts, setCounts] = React.useState({
    products: 0,
    vendors: 0,
    users: 0,
    productCategories: 0,
  });

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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden">
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
            <div className="pl-40 mt-32 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-5xl font-bold mb-4">
                    One community, one market place.
                  </h1>
                  <p className="max-w-lg text-lg mb-6">
                    Easily browse, compare, and contact businesses to get what
                    you need—fast and conveniently. Join us in building a
                    stronger, more connected neighborhood!
                  </p>
                </div>
                <div className="relative size-96 ml-80">
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
        <section className="py-20">
          <div className="px-20">
            <div id='mission-and-vision' className="grid lg:grid-cols-5 grid-cols-1 gap-40">
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
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-10">
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
            <div className="grid md:grid-cols-2 mt-20 gap-12">
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
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
                Our Strengths
              </h2>
              <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
                Discover what makes 1 Market Philippines uniquely positioned to
                serve local communities and empower small businesses
              </p>
              <div className="space-y-8">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-8 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg ${
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
          <div className="mt-20 px-20">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
              1 Market Philippines vs Major e-commerce platforms
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              See how our community-focused approach gives us unique advantages
              in serving local businesses and customers
            </p>
            <div className="overflow-x-auto">
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
                          className={`p-6 text-center ${row.advantage === "Others" ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-600"}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {row.advantage === "Others" && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                            {row.advantage === "1MP" && (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <span>{row.lazada}</span>
                          </div>
                        </td>
                        <td
                          className={`p-6 text-center ${row.advantage === "Others" ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-600"}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {row.advantage === "Others" && (
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
            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                * Our community-focused approach provides unique advantages in
                delivery speed, personal connections, and supporting local
                economy
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br mt-20 from-gray-50 to-gray-100 p-12 border border-gray-200">
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
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
              Latest from 1 Market Philippines
            </h2>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
