/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ProductReview } from "@prisma/client";
import { MapPin, ShieldCheck, Star, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

const ProductReviews = ({
  reviews,
}: {
  reviews: (ProductReview & {
    user?: any & { address: any[] };
  })[];
}) => {
  const [activeTab, setActiveTab] = useState("product");
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, number>>(
    {}
  );

  // ✅ Make sure avgRating is always a number
  const avgRating =
    reviews.length > 0
      ? parseFloat(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        )
      : 0;

  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return "Very satisfied";
    if (rating === 4) return "Satisfied";
    if (rating === 3) return "Neutral";
    if (rating === 2) return "Unsatisfied";
    return "Very unsatisfied";
  };

  // ✅ Helper to format address nicely
  const formatAddress = (user: any) => {
    const address = user?.address?.find((a: any) => a.isDefault) || user?.address?.[0];
    if (!address) return null;

    return `${address.homeAddress}, ${address.barangay}, ${address.city}, ${address.province}`;
  };

  return (
    <div className="w-full bg-white">
      <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

      {/* Tabs */}
      <div className="flex w-full border-b mb-6">
        <button
          onClick={() => setActiveTab("product")}
          className={`pb-3 px-1 font-medium text-sm transition-colors ${
            activeTab === "product"
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Product reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("store")}
          className={`pb-3 px-6 font-medium text-sm transition-colors ${
            activeTab === "store"
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Store reviews (340)
        </button>
      </div>

      {activeTab === "product" && (
        <>
          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="mb-8 flex items-start gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`fill-yellow-500 ${
                          i < Math.round(avgRating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {getRatingLabel(Math.round(avgRating))}
                </p>
                <p className="text-gray-500 text-sm">
                  Based on {reviews.length} reviews for{" "}
                  <span className="text-green-600 font-medium">
                    verified purchases
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const userAddress = formatAddress(review.user);
                return (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                          {review.user?.firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {review.isAnonymous
                              ? "Anonymous"
                              : `${review.user?.firstName || ""} ${
                                  review.user?.lastName || ""
                                }`}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {userAddress && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin size={14} className="text-gray-400" />
                                {userAddress}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ShieldCheck
                                size={14}
                                className="text-green-600"
                              />
                              Verified purchase
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`fill-yellow-500 ${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-yellow-600 ml-2">
                        {getRatingLabel(review.rating)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-sm mb-4">{review.review}</p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border border-gray-200"
                          />
                        ))}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHelpful(review.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <ThumbsUp size={16} />
                        <span className="text-xs font-medium">
                          Helpful ({helpfulReviews[review.id] || 0})
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            )}
          </div>
        </>
      )}

      {activeTab === "store" && (
        <div className="text-center py-8 text-gray-500">
          Store reviews coming soon
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
