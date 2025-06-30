"use client";

import React from "react";
import { ProductWithProps } from "@/types";
import DOMPurify from "dompurify";

interface ProductDescriptionProps {
  product: ProductWithProps | null;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  // Safely render HTML content
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

  if (!product?.description) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Product Description</h3>
        <p className="text-gray-500">No description available</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Product Description</h3>
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={createMarkup(product.description)}
      />
    </div>
  );
};

export default ProductDescription;
