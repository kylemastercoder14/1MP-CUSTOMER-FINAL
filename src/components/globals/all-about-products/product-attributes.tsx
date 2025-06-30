"use client";

import React from "react";
import { ProductWithProps } from "@/types";
import { productType } from "@/lib/utils";

interface AttributeRowProps {
  label: string;
  value: React.ReactNode;
  condition?: boolean;
}

const AttributeRow = ({
  label,
  value,
  condition = true,
}: AttributeRowProps) => {
  if (!condition) return null;

  return (
    <div className="grid lg:grid-cols-2 border-b grid-cols-1">
      <span className="bg-zinc-100 px-3 py-2">{label}</span>
      <span className="px-3 py-2">{value || "N/A"}</span>
    </div>
  );
};

const ProductAttributes = ({
  product,
}: {
  product: ProductWithProps | null;
}) => {
  const type = productType(product?.categorySlug || "");
  const isFood = type === "Food";

  // Common attributes for all product types
  const commonAttributes = [
    {
      label: "Brand",
      value: product?.brand,
      condition: !!product?.brand,
    },
    {
      label: "Type",
      value: product?.category?.name,
      condition: true,
    },
    {
      label: "Category",
      value: product?.subCategory?.name,
      condition: true,
    },
  ];

  // Food-specific attributes (shown in table for non-food)
  const foodAttributes = [
    {
      label: "Weight",
      value:
        product?.weight && product.weightUnit
          ? `${product.weight} ${product.weightUnit}`
          : null,
      condition: type === "Food",
    },
    {
      label: "Country of Origin",
      value: product?.countryOfOrigin,
      condition: type === "Food" && !!product?.countryOfOrigin,
    },
  ];

  // Non-food attributes
  const nonFoodAttributes = [
    {
      label: "Weight",
      value:
        product?.weight && product.weightUnit
          ? `${product.weight} ${product.weightUnit}`
          : null,
      condition: type === "NonFood" && !!product?.weight,
    },
    {
      label: "Dimension",
      value:
        product?.length && product.width && product.height
          ? `${product.length} x ${product.width} x ${product.height} ${product.dimensionUnit}`
          : null,
      condition: type === "NonFood",
    },
    {
      label: "Fragile",
      value: product?.isFragile ? "Yes" : "No",
      condition: type === "NonFood",
    },
  ];

  // Service-specific attributes
  const serviceAttributes = [
    {
      label: "Service Duration",
      value: product?.serviceDuration,
      condition: type === "Service" && !!product?.serviceDuration,
    },
    {
      label: "Service Type",
      value: product?.serviceLocationType?.join(", "),
      condition: type === "Service" && product?.serviceLocationType?.length,
    },
    {
      label: "Service Areas",
      value: product?.serviceAreas?.join(", "),
      condition: type === "Service" && product?.serviceAreas?.length,
    },
    {
      label: "Scheduling",
      value: product?.schedulingRequired ? "Required" : "Optional",
      condition: type === "Service",
    },
  ];

  // Combine all relevant attributes for non-food products
  const allAttributes = [
    ...commonAttributes,
    ...foodAttributes,
    ...nonFoodAttributes,
    ...serviceAttributes,
  ].filter((attr) => attr.condition);

  // Split into two columns for non-food products
  const midPoint = Math.ceil(allAttributes.length / 2);
  const leftColumn = allAttributes.slice(0, midPoint);
  const rightColumn = allAttributes.slice(midPoint);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        {isFood ? "Nutritional Information" : "Key Attributes"}
      </h3>

      {isFood ? (
        <div className="w-full">
          {/* Ingredients Section */}
          {product?.ingredients && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Ingredients</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {product.ingredients}
              </p>
            </div>
          )}

          {/* Allergens Section */}
          {product?.allergens?.length ? (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Allergens</h4>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Nutritional Facts Table */}
          {product?.nutritionalFacts?.length && (
            <div className="mb-6">
              <div className="bg-white border-2 border-black p-4 max-w-md">
                {product.nutritionalFacts.map((facts, index) => (
                  <div key={index}>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold border-b-8 border-black pb-1 mb-2">
                        Nutrition Facts
                      </h3>
                      <div className="text-sm border-b border-black pb-1 mb-1">
                        Serving size {facts.servingSize || "Not specified"}
                      </div>
                      <div className="text-sm border-b-4 border-black pb-2 mb-2">
                        Servings per container{" "}
                        {facts.servingsPerContainer || "Not specified"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center border-b-8 border-black pb-1">
                        <span className="text-2xl font-bold">Calories</span>
                        <span className="text-2xl font-bold">
                          {facts.calories || "0"}
                        </span>
                      </div>

                      <div className="text-right text-sm font-bold border-b border-black pb-1">
                        % Daily Value*
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between border-b border-gray-300">
                          <span>
                            <strong>Total Fat</strong> {facts.totalFat || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pl-4">
                          <span>
                            Saturated Fat {facts.saturatedFat || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pl-4">
                          <span>
                            <em>Trans</em> Fat {facts.transFat || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300">
                          <span>
                            <strong>Cholesterol</strong>{" "}
                            {facts.cholesterol || "0mg"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300">
                          <span>
                            <strong>Sodium</strong> {facts.sodium || "0mg"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300">
                          <span>
                            <strong>Total Carbohydrate</strong>{" "}
                            {facts.totalCarbohydrates || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pl-4">
                          <span>
                            Dietary Fiber {facts.dietaryFiber || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pl-4">
                          <span>Total Sugars {facts.totalSugars || "0g"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pl-8">
                          <span>
                            Includes {facts.addedSugars || "0g"} Added Sugars
                          </span>
                        </div>
                        <div className="flex justify-between border-b-4 border-black pb-2">
                          <span>
                            <strong>Protein</strong> {facts.protein || "0g"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vitamin D {facts.vitaminD || "0mcg"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calcium {facts.calcium || "0mg"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Iron {facts.iron || "0mg"}</span>
                        </div>
                        <div className="flex justify-between border-b-4 border-black pb-2">
                          <span>Potassium {facts.potassium || "0mg"}</span>
                        </div>
                      </div>

                      <div className="text-xs pt-2">
                        * The % Daily Value (DV) tells you how much a nutrient
                        in a serving of food contributes to a daily diet. 2,000
                        calories a day is used for general nutrition advice.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage Instructions */}
          {product?.storageInstructions && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Storage Instructions</h4>
              <p className="text-gray-700">{product.storageInstructions}</p>
            </div>
          )}
        </div>
      ) : (
        /* Regular product attributes table for non-food items */
        <div className="w-full">
          <div className="grid lg:grid-cols-2 border grid-cols-1">
            <div>
              {leftColumn.map((attr, index) => (
                <AttributeRow
                  key={`left-${index}`}
                  label={attr.label}
                  value={attr.value}
                />
              ))}
            </div>
            <div>
              {rightColumn.map((attr, index) => (
                <AttributeRow
                  key={`right-${index}`}
                  label={attr.label}
                  value={attr.value}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Tags Section (shown for all product types) */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-3">Product Tags</h3>
        {product?.tags && product.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">No tags available</span>
        )}
      </div>
    </div>
  );
};

export default ProductAttributes;
