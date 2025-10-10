/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
        <div className="w-full lg:h-[500px] h-auto bg-zinc-200 relative pt-28 overflow-hidden flex items-center">
          {/* Main Container: Flexbox for responsive layout */}
          <div className="flex flex-col lg:flex-row items-center justify-center w-full px-10 lg:px-20 lg:mt-0 mt-14 py-10 lg:py-0">
            {/* Content Section - text and description */}
            <div className="flex-1 lg:text-left mb-8 lg:mb-0 lg:pr-10">
              <h1 className="text-2xl md:text-5xl font-bold mb-4">
                How to start selling on{" "}
                <span className="text-[#800020]">1 Market Philippines</span>
              </h1>
              <p className="max-w-lg text-lg mb-6 mx-auto lg:mx-0">
                Ready to go online? Follow our simple onboarding process to
                become a verified seller on 1 Market Philippines. Complete your
                profile, upload required documents, and start reaching customers
                today!
              </p>
            </div>

            {/* Image Section */}
            <div className="flex-1 -mt-20 lg:-mt-0 lg:-mb-0 -mb-16 flex justify-center lg:justify-end">
              <div className="rounded-full relative lg:size-[500px] size-[400px]">
                <Image
                  src="/start-selling.png"
                  alt="Start selling"
                  fill
                  className="size-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <section className="lg:py-16 py-10 pb-0 lg:px-20 px-10">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Verified Seller
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Complete your seller onboarding to start selling on 1 Market
              Philippines. Get verified and unlock all seller features.
            </p>
          </div>
          <Separator className="mb-8" />

          {/* Onboarding Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Seller Onboarding Process
            </h2>
            <p className="mb-6 text-gray-600">
              After registering and verifying your email, you'll be redirected
              to complete the Seller Onboarding form. This final step gathers
              essential business information to verify your store's identity and
              ensure you're properly set up to sell on our platform.
            </p>

            <div className="mb-8 bg-white p-6 border shadow">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Why Complete This Form?
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Verify your business legitimacy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Match you to the correct product/service category</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ensure secure transactions and payouts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Provide tailored seller features and support</span>
                </li>
              </ul>
            </div>

            {/* Requirements Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Requirements
              </h3>

              {/* Store Details */}
              <div className="mb-8 p-6 bg-white border shadow">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🛍️</span> Store Details
                </h4>
                <div className="lg:pl-8">
                  <h5 className="font-medium text-gray-700 mb-2">Store Name</h5>
                  <p className="text-gray-600 mb-4">
                    This is the public name customers will see. It must be
                    unique and cannot be changed once approved.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-700">
                      <strong>Tip:</strong> Avoid special characters or
                      misleading names. Check for typos — this name appears on
                      your receipts.
                    </p>
                  </div>

                  <h5 className="font-medium text-gray-700 mb-2">
                    Product/Service Category
                  </h5>
                  <p className="text-gray-600 mb-2">
                    Choose from predefined categories to help customers find
                    your store:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-gray-600 mb-4">
                    <li>• Clothing & Accessories</li>
                    <li>• Electronics</li>
                    <li>• Food & Beverage</li>
                    <li>• Health & Wellness</li>
                    <li>• Home & Living</li>
                    <li>• Digital Services</li>
                    <li>• Others...</li>
                  </ul>
                </div>
              </div>

              {/* Business Type */}
              <div className="mb-8 p-6 bg-white border shadow">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏢</span> Business Type & Legal
                  Structure
                </h4>
                <div className="lg:pl-8">
                  <p className="text-gray-600 mb-4">
                    Select the structure that represents your business. This
                    affects required documents:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border p-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Individual
                      </h5>
                      <p className="text-gray-600 text-sm">
                        For casual sellers or freelancers. Requires valid ID and
                        barangay permit.
                      </p>
                    </div>
                    <div className="border p-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Sole-Proprietorship
                      </h5>
                      <p className="text-gray-600 text-sm">
                        For DTI-registered businesses. Requires DTI certificate
                        and barangay permit.
                      </p>
                    </div>
                    <div className="border p-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Corporation
                      </h5>
                      <p className="text-gray-600 text-sm">
                        SEC-registered companies. Requires SEC documents, BIR,
                        and business permits.
                      </p>
                    </div>
                    <div className="border p-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Partnership
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Registered with SEC. Requires SEC, BIR, and local
                        permits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="mb-8 p-6 bg-white border shadow">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">👤</span> Seller Information
                </h4>
                <div className="lg:pl-8">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Seller Name
                  </h5>
                  <p className="text-gray-600">
                    Your full legal name or business representative's name. Must
                    match your ID or business documents to avoid rejection.
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-8 p-6 bg-white border shadow">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📄</span> Upload Required Documents
                </h4>
                <div className="lg:pl-8">
                  <p className="text-gray-600 mb-4">
                    Depending on your business type, you'll need to upload:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 mb-4">
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>Valid government-issued ID</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>Barangay Business Permit (required for all)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>
                        SEC Certificate (for Corporations/Partnerships)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>DTI Certificate (for Sole Proprietorships)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✅</span>
                      <span>BIR Certificate (optional but recommended)</span>
                    </li>
                  </ul>
                  <p className="text-gray-600 mb-2">
                    <strong>File Types Accepted:</strong> JPG, PNG, or PDF.
                    Files must be clear and not blurred or cropped.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">
                      <strong>Tip:</strong> Upload all required files at once to
                      speed up approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* After Submission */}
            <div className="p-6 bg-white border shadow">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                After Submission
              </h3>
              <p className="text-gray-600 mb-6">
                Once submitted, your status will change to "Under Review". Our
                admin team will verify your application.
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  Review Timeline:
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">⏱️</span>
                    <span>
                      <strong>Initial review:</strong> within 24–48 hours
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⏱️</span>
                    <span>
                      <strong>Follow-up (if needed):</strong> up to 3–5 business
                      days
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⏱️</span>
                    <span>
                      <strong>Final approval:</strong> 1–2 business days after
                      full submission
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-600 mb-4">
                You'll receive a confirmation email upon approval. Then you can
                access the seller dashboard and start listing products.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
