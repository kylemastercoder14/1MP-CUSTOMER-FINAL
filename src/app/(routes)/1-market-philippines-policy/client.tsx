"use client";

import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";

interface PolicyData {
  content: string | null;
  updatedAt: string | null;
}

interface EmptyPolicyStateProps {
  message?: string;
}

const PolicyLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-10">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading policy content...</p>
    </div>
  );
};

const EmptyPolicyState: React.FC<EmptyPolicyStateProps> = ({
  message = "No policy content found for this type. Please check back later!",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-10 bg-white">
      <div className="relative w-48 h-48 mb-6">
        <Image
          src="/images/empty-products.svg"
          alt="No content available"
          fill
          objectFit="contain"
        />
      </div>
      <p className="text-xl font-semibold text-gray-700 text-center max-w-md px-4">
        {message}
      </p>
      <p className="mt-2 text-md text-gray-500 text-center">
        We&apos;re working to bring you the information you need.
      </p>
    </div>
  );
};

const Client = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type")?.replace(/-/g, " ") || "Policy";
  const [policyData, setPolicyData] = React.useState<PolicyData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/policies?type=${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch policy data.");
        }
        const data: PolicyData = await response.json();
        if (data.content === null || data.content.trim() === "") {
          setPolicyData(null);
        } else {
          setPolicyData(data);
        }
      } catch (err) {
        console.error("Failed to fetch policy:", err);
        setError("Could not load policy content. Please try again later.");
        setPolicyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [type]);

  // Helper function to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // Determine content to display
  let contentToRender = "No content available.";
  if (isLoading) {
    contentToRender = "Loading policy content...";
  } else if (error) {
    contentToRender = error;
  } else if (policyData?.content) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contentToRender = policyData.content;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full h-[500px] relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
          {/* Content - Aligned to left */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-40 mt-32 text-black">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl capitalize md:text-5xl font-bold mb-4">
                    {type}
                  </h1>
                  <p className="max-w-3xl text-lg mb-6">
                    Learn about the policies and regulations that govern the
                    market in the Philippines. This section provides insights
                    into the legal framework, compliance requirements, and best
                    practices for businesses operating in this region.
                  </p>
                </div>
                <div className="relative size-[400px] ml-80">
                  <Image
                    src="/policy.png"
                    alt="Policy"
                    fill
                    className="size-full shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="bg-white pb-20 pt-10 px-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{type}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-10">
            <h2 className="text-center text-4xl font-semibold tracking-tight capitalize">
              {type}
            </h2>
            <p className="text-center font-medium mt-5 text-gray-600 mb-6">
              Date Updated: {formatDate(policyData?.updatedAt ?? null)}
            </p>
            <div>
              {isLoading ? (
                <PolicyLoader />
              ) : error ? (
                <EmptyPolicyState message={error} />
              ) : policyData?.content ? (
                <div
                  className="mt-10 prose max-w-none prose-md"
                  dangerouslySetInnerHTML={{ __html: policyData.content }}
                />
              ) : (
                <EmptyPolicyState />
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
