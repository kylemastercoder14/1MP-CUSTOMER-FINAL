"use client";

import React from "react";
import { ProductWithProps } from "@/types";
import DOMPurify from "dompurify";

interface ProductPolicyProps {
  product: ProductWithProps | null;
}

const ProductPolicy = ({ product }: ProductPolicyProps) => {
  // Safely render HTML content (same sanitizer as ProductDescription)
  const createMarkup = (htmlContent: string) => {
    return {
      __html: DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
          "p",
          "strong",
          "em",
          "u",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "a",
          "br",
          "span",
          "div",
          "blockquote",
          "hr",
          "img",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style"],
      }),
    };
  };

  if (!product) {
    return null;
  }

  // Check if any policy exists
  const hasPolicies = product.shippingPolicy || product.returnPolicy || product.warrantyContent;

  if (!hasPolicies) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Product Policies</h3>
        <p className="text-gray-500">No policy information available</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Product Policies</h3>

      {/* Shipping Policy */}
      {product.shippingPolicy && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Shipping Policy</h4>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={createMarkup(product.shippingPolicy)}
          />
        </div>
      )}

      {/* Return Policy */}
      {product.returnPolicy && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Return Policy</h4>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={createMarkup(product.returnPolicy)}
          />
        </div>
      )}

      {/* Warranty Information */}
      {product.warrantyContent && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">
            {product.warrantyDuration ? `Warranty (${product.warrantyDuration})` : "Warranty"}
          </h4>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={createMarkup(product.warrantyContent)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPolicy;
