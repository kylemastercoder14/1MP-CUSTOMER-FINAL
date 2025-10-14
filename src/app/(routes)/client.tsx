/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import {
  Shield,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle,
  Lock,
  CreditCard,
  PackageCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/globals/header";
import { NumberTicker } from "@/components/animated-ui/number-ticker";
import { Category } from "@prisma/client";
import { CategoriesCarousel } from "@/components/globals/categories-carousel";
import Link from "next/link";
import Image from "next/image";
import StepsFeature from "@/components/globals/steps-feature";
import Footer from "@/components/globals/footer";
import { NewsWithSections } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { paymentMethods } from "@/constants";
import MostPopularProducts from "@/components/globals/business-opportunity/most-popular";
import NewArrivalProducts from "@/components/globals/business-opportunity/new-arrival";
import MostRatedProducts from "@/components/globals/business-opportunity/most-rated";

const images = [
  "/banners/1.png",
  "/banners/2.png",
  "/banners/3.png",
  "/banners/4.png",
  "/banners/5.png",
  "/banners/6.png",
  "/banners/7.png",
];

export default function Client() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [newsArticles, setNewsArticles] = React.useState<NewsWithSections[]>(
    []
  );
  const [loadingNews, setLoadingNews] = React.useState<boolean>(true);
  const [counts, setCounts] = React.useState({
    products: 0,
    vendors: 0,
    users: 0,
    productCategories: 0,
  });

  const [current, setCurrent] = React.useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-loop every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
        setLoadingNews(true);
        const response = await fetch("/api/v1/news-articles");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setNewsArticles(result.data);
        }
      } catch (err) {
        console.error("Error fetching news articles:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);
  return (
    <div className="min-h-screen">
      <section className="relative">
        {/* Header */}
        <Header />
        <div className="relative z-10 lg:px-80 px-10 lg:pb-14 pb-10 lg:pt-40 pt-24">
          <div className="grid lg:grid-cols-10 gap-3 grid-cols-1">
            <div className="lg:col-span-8 relative w-full h-[330px] overflow-hidden rounded-md">
              {images.map((src, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute top-0 left-0 w-full h-full transition-opacity duration-500",
                    index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <Image
                    src={src}
                    alt={`banner-${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Prev/Next Buttons */}
              <Button
                size="sm"
                className="absolute bg-black/50 rounded-full hover:bg-white hover:text-black left-2 top-1/2 -translate-y-1/2 z-20"
                onClick={prevSlide}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                size="sm"
                className="absolute bg-black/50 rounded-full hover:bg-white hover:text-black right-2 top-1/2 -translate-y-1/2 z-20"
                onClick={nextSlide}
              >
                <ArrowRight className="size-4" />
              </Button>

              {/* Radio Buttons */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {images.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    className={`size-3 ${current === index ? "bg-white border border-black" : "bg-black/50"}  rounded-full p-0`}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 h-[330px] w-full p-3 bg-gradient-to-br from-red-100 via-red-50 to-red-100 rounded-md">
              <div>
                <p className="text-sm font-semibold">Supported payments:</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`size-8 relative`}
                      title={method.name}
                    >
                      <Image
                        alt={method.name}
                        src={method.src}
                        fill
                        className="size-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center mt-1">
                  <Image src="/qr.png" alt="Qr code" width={80} height={80} />
                  <div className="gap-2 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative w-full h-10"
                    >
                      <Image
                        src="https://s.alicdn.com/@img/imgextra/i4/O1CN01i9Aj641atkjJJ9I6y_!!6000000003388-2-tps-396-132.png"
                        alt="App store"
                        fill
                        className="size-full object-contain"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative w-full h-9"
                    >
                      <Image
                        src="https://s.alicdn.com/@img/imgextra/i4/O1CN018KnDNq1JleFgkjLRq_!!6000000001069-2-tps-447-132.png"
                        alt="Google play store"
                        fill
                        className="size-full object-contain"
                      />
                    </Button>
                  </div>
                </div>
                <p className="text-xs mt-1">
                  Download the app now by scanning the QR code
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-20 bg-[#3a190b]">
        <div className="lg:px-80 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group">
              <div className="bg-feature-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-feature-icon w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#800020] transition-colors">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Thousands of business offerings
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  Explore products and sellers for your business from thousands
                  of offerings in our community.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group">
              <div className="bg-feature-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-feature-icon w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#800020] transition-colors">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Assured quality and transactions
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  Ensure production quality from verified sellers, with your
                  orders protected from payment to delivery.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group">
              <div className="bg-feature-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-feature-icon w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#800020] transition-colors">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  One-stop purchase protection & solution
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  Order seamlessly from product/seller search to order
                  management, payment, and fulfillment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white lg:py-20 py-10">
        <div className="lg:px-80 px-0">
          <div className="grid lg:px-0 px-10 lg:grid-cols-5 grid-cols-1 lg:gap-40 gap-10">
            <div className="lg:col-span-3">
              <h3 className="text-black lg:text-[33px] text-2xl font-bold lg:leading-snug tracking-tight">
                Explore thousands of businesses in your neighborhood and
                discover the best products and services they offer.
              </h3>
            </div>
            <div className="lg:col-span-2">
              <div className="grid lg:grid-cols-2 grid-cols-2 gap-y-10">
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
          <CategoriesCarousel categories={categories} />
        </div>
      </section>

      <section className="lg:py-20 py-10 bg-[#f5f5f5]">
        <div className="lg:px-80 px-10">
          <h3 className="text-3xl tracking-tight font-bold">
            Discover your next business opportunity
          </h3>
          <div className="grid lg:grid-cols-3 mt-10 grid-cols-1 gap-5">
            <MostPopularProducts />
            <NewArrivalProducts />
            <MostRatedProducts />
          </div>
        </div>
      </section>

      <section className="bg-white lg:py-20 py-10">
        <div className="lg:px-80 px-10">
          <h3 className="text-3xl tracking-tight font-bold">
            News and announcements you should know
          </h3>
          <div className="grid lg:grid-cols-3 grid-cols-1 mt-10 gap-10">
            {loadingNews ? (
              <>
                <div>
                  <Skeleton className="h-[30vh] w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
                <div>
                  <Skeleton className="h-[30vh] w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
                <div>
                  <Skeleton className="h-[30vh] w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
              </>
            ) : newsArticles.length > 0 ? (
              newsArticles.slice(0, 3).map((article) => (
                <div key={article.id}>
                  <div className="relative w-full h-[30vh]">
                    <Image
                      src={
                        article.thumbnail || "https://via.placeholder.com/920"
                      }
                      alt={article.title}
                      fill
                      className="size-full rounded-lg object-cover"
                    />
                    {/* overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg" />
                    <div className="absolute bottom-6 left-6 font-semibold pr-6 text-white">
                      <p className="text-lg mb-4 line-clamp-1">
                        {article.title}
                      </p>
                      <Link
                        href={`/news-center/${article.id}`}
                        className="underline text-base"
                      >
                        View more
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 text-lg">
                No news articles found.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="banner-background relative">
        <div className="absolute inset-0 bg-[#49271c]/70" />
        <div className="lg:px-80 px-10 lg:py-24 py-10 relative z-10">
          <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-5xl font-bold text-white text-center md:text-left">
            Shop with Confidence - Quality Products & Buyer Protection
          </h3>
          <p className="mt-4 text-lg text-white/90 max-w-4xl text-center md:text-left">
            We guarantee a safe and satisfying shopping experience from
            selection to delivery
          </p>

          <div className="grid mt-16 lg:grid-cols-2 grid-cols-1 gap-6 md:gap-10">
            {/* Quality Assurance Card */}
            <div className="glass-bg p-8 md:p-10 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <ShieldCheck className="text-white h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-white">
                  Quality You Can Trust
                </p>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-5">
                Verified Sellers
              </h3>
              <p className="mt-5 text-white/90">
                Every seller on our platform undergoes strict verification. We
                check business licenses, product quality samples, and customer
                service standards so you can shop with peace of mind.
              </p>
              <ul className="mt-5 space-y-2 text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Authentic product guarantees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Customer rating & review system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Return policy enforcement</span>
                </li>
              </ul>
              <div className="flex items-center gap-3 mt-8">
                <Link href="/become-a-verified-seller" target='_blank' className="button-glass-effect hover:bg-white/20 transition-colors duration-300">
                  How we verify sellers
                </Link>
              </div>
            </div>

            {/* Purchase Protection Card */}
            <div className="glass-bg p-8 md:p-10 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="text-white h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-white">
                  Safe Transactions
                </p>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-5">
                Buyer Protection
              </h3>
              <p className="mt-5 text-white/90">
                Your purchase is protected from payment to delivery. If items
                don't arrive or don't match the description, we'll help you get
                a full refund.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <CreditCard className="h-8 w-8 text-white mb-2" />
                  <p className="font-medium text-white">Secure Payments</p>
                  <p className="text-sm text-white/80 mt-1">
                    Encrypted transactions via Xendit
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <PackageCheck className="h-8 w-8 text-white mb-2" />
                  <p className="font-medium text-white">Delivery Guarantee</p>
                  <p className="text-sm text-white/80 mt-1">
                    On-time shipping or compensation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-8">
                <Link href="/safe-and-easy-payments" target='_blank' className="button-glass-effect hover:bg-white/20 transition-colors duration-300">
                  Protection details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StepsFeature />

      <section className="lg:py-20 pt-10 bg-[#f7f2f0]">
        <div className="lg:px-80 px-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-7xl mx-auto">
              Explore thousands of products and services from local businesses
              in our area. Whether you're looking for supplies, equipment, or
              services, 1 Market Philippines has you covered. Join our community
              of buyers and sellers today and discover the best that your
              neighborhood has to offer.
            </p>
            <button className="mt-10">
              <Link
                href="/sign-up"
                className="bg-[#800020] hover:bg-[#800020]/80 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Join Now
              </Link>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
