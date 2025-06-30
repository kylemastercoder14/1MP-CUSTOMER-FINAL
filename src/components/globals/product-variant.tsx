/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { ProductVariantsProps } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { RulerDimensionLine } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export function ProductVariants({
  variants,
  specifications,
  onVariantSelect,
  selectedVariantId,
  sizeGuide,
}: ProductVariantsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  // Convert variants to typed variants
  const typedVariants = useMemo(() => {
    return variants.map((variant) => ({
      ...variant,
      attributes: variant.attributes as Record<string, string> | null,
    }));
  }, [variants]);

  // Initialize selectedAttributes when selectedVariantId changes
  useEffect(() => {
    if (selectedVariantId) {
      const variant = typedVariants.find((v) => v.id === selectedVariantId);
      if (variant?.attributes) {
        setSelectedAttributes(variant.attributes);
      }
    }
  }, [selectedVariantId, typedVariants]);

  // Extract all possible attributes from specifications
  const attributeOptions = useMemo(() => {
    return specifications.reduce(
      (acc, spec) => {
        acc[spec.attribute] = spec.values;
        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [specifications]);

  // Find the currently selected variant based on selected attributes
  const findMatchingVariant = (attributes: Record<string, string>) => {
    return typedVariants.find((variant) => {
      if (!variant.attributes) return false;
      return Object.entries(attributes).every(
        ([key, value]) => variant.attributes?.[key] === value
      );
    });
  };

  // Handle attribute selection
  const handleAttributeSelect = (attribute: string, value: string) => {
    const newAttributes = {
      ...selectedAttributes,
      [attribute]: value,
    };
    setSelectedAttributes(newAttributes);

    // Find matching variant and notify parent
    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      onVariantSelect?.(matchingVariant);
    }
  };

  // Get available options considering current selections
  const getAvailableOptions = (attribute: string) => {
    // If no selections made yet, all options are available
    if (Object.keys(selectedAttributes).length === 0) {
      return attributeOptions[attribute];
    }

    // Filter options based on what's available with current selections
    return variants
      .filter((variant) => {
        if (!variant.attributes) return false;

        return Object.entries(selectedAttributes)
          .filter(([key]) => key !== attribute)
          .every(
            ([key, value]) =>
              variant.attributes && variant.attributes[key] === value
          );
      })
      .map((variant) => variant.attributes?.[attribute])
      .filter(
        (value, index, self) => value && self.indexOf(value) === index
      ) as string[];
  };

  return (
    <>
      {/* Modal and JSX remain the same */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Size Guide"
        description="View the size chart to find your perfect fit."
      >
        <div className="relative w-full h-60">
          <Image
            src={sizeGuide || ""}
            alt="Size chart"
            fill
            className="size-full"
          />
        </div>
      </Modal>
      <div className="mt-2 mb-4 space-y-6">
        {Object.entries(attributeOptions).map(([attribute, _]) => (
          <div key={attribute}>
            {attribute === "size" && sizeGuide ? (
              <div className="flex items-center justify-between mb-2 gap-3">
                <h4 className="font-medium capitalize">{attribute}</h4>
                <span
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-1 text-sm cursor-pointer font-medium text-[#800020]"
                >
                  <RulerDimensionLine className="size-4" />
                  Size Guide
                </span>
              </div>
            ) : (
              <h4 className="font-medium mb-2 capitalize">{attribute}</h4>
            )}

            {attribute === "color" ? (
              <div className="flex flex-wrap gap-2">
                {getAvailableOptions(attribute).map((value) => {
                  const colorVariant = variants.find(
                    (v) => v.attributes?.[attribute] === value
                  );

                  return (
                    <button
                      key={value}
                      onClick={() => handleAttributeSelect(attribute, value)}
                      className={`border rounded-md px-3 py-2 flex items-center gap-2 transition-colors ${
                        selectedAttributes[attribute] === value
                          ? "border-[#800020] bg-[#800020]/10"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {colorVariant?.image && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={colorVariant.image}
                            alt={value}
                            fill
                            className="object-cover rounded-sm"
                            sizes="24px"
                          />
                        </div>
                      )}
                      <span className="text-sm">{value}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {getAvailableOptions(attribute).map((value) => {
                  const isAvailable = variants.some((v) => {
                    if (!v.attributes) return false;
                    return (
                      v.attributes &&
                      Object.entries({
                        ...selectedAttributes,
                        [attribute]: value,
                      }).every(
                        ([key, val]) =>
                          v.attributes && v.attributes[key] === val
                      ) &&
                      v.quantity > 0
                    );
                  });

                  return (
                    <button
                      key={value}
                      onClick={() => handleAttributeSelect(attribute, value)}
                      className={`min-w-12 h-10 px-3 flex items-center justify-center border rounded-md transition-colors ${
                        selectedAttributes[attribute] === value
                          ? "border-[#800020] bg-[#800020]/10"
                          : isAvailable
                            ? "border-gray-200 hover:border-gray-400"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isAvailable}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
