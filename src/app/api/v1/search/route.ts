/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductWithProps } from "@/types";

export async function POST(request: Request) {
  try {
    const { sortBy } = await request.json();

    let orderBy = {};

    switch (sortBy) {
      case "Best seller":
        // Assuming you have an order count or sales field
        orderBy = { soldCount: "desc" };
        break;
      case "Price low to high":
        // Sort by the minimum variant price or product price
        orderBy = { price: "asc" };
        break;
      case "Price high to low":
        orderBy = { price: "desc" };
        break;
      default:
        // Default sorting (could be by createdAt or any other field)
        orderBy = { createdAt: "desc" };
    }

    const rawProducts = await db.product.findMany({
      where: {
        adminApprovalStatus: "Approved",
      },
      include: {
        vendor: true,
        specifications: true,
        variants: true,
        newArrivalDiscount: true,
        productDiscount: true,
        category: true,
        subCategory: true,
      },
      orderBy,
    });

    // Map rawProducts to ensure variants.attributes is of type VariantAttributes
    const products: ProductWithProps[] = rawProducts.map((product) => ({
      ...product,
      category: product.category,
      subCategory: product.subCategory,
      variants: product.variants.map((variant) => ({
        ...variant,
        attributes: variant.attributes as any,
      })),
    }));

    // For price sorting, we need to handle variants
    if (sortBy === "Price low to high" || sortBy === "Price high to low") {
      products.sort((a, b) => {
        // Get the minimum price for each product (considering variants)
        const getMinPrice = (product: ProductWithProps) => {
          if (product.variants.length > 0) {
            return Math.min(...product.variants.map((v) => v.price));
          }
          return product.price || Infinity;
        };

        const priceA = getMinPrice(a);
        const priceB = getMinPrice(b);

        return sortBy === "Price low to high"
          ? priceA - priceB
          : priceB - priceA;
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in search route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
