/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductWithProps } from "@/types";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const {
      sortBy,
      categories,
      subcategories,
      specifications, // { [attribute: string]: string[] }
      minPrice,
      maxPrice,
      popularityRanges, // string[] (e.g., ["10.0", "Below5.0"])
      ratings, // string[] (e.g., ["4.0", "5.0"])
    } = (await request.json()) as {
      // Explicitly type the request body
      sortBy: string;
      categories: string | undefined;
      subcategories: string | string[] | undefined; // Can be string (from URL) or string[] (from filter)
      specifications: Record<string, string[]> | undefined;
      minPrice: number | null;
      maxPrice: number | null;
      popularityRanges: string[] | undefined;
      ratings: string[] | undefined;
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

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
      case "Most popular":
        orderBy = { popularityScore: "desc" };
        break;
      default:
        // Default sorting (could be by createdAt or any other field)
        orderBy = { createdAt: "desc" };
    }

    const whereClause: Prisma.ProductWhereInput = {
      adminApprovalStatus: "Approved",
    };

    // Apply Category filter (if any)
    if (categories) {
      whereClause.categorySlug = categories;
    }

    // Apply Subcategory filters (if any)
    if (subcategories && subcategories.length > 0) {
      if (typeof subcategories === "string") {
        whereClause.subCategorySlug = subcategories;
      } else if (Array.isArray(subcategories) && subcategories.length === 1) {
        whereClause.subCategorySlug = subcategories[0];
      } else if (Array.isArray(subcategories) && subcategories.length > 1) {
        whereClause.subCategorySlug = { in: subcategories };
      }
    }

    // Initialize an array for combined AND conditions
    const andConditions: Prisma.ProductWhereInput[] = [];

    // Apply Price Range filter
    if (minPrice !== null || maxPrice !== null) {
      // Create OR condition for price: either product.price or any variant.price matches
      andConditions.push({
        OR: [
          { price: { gte: minPrice || undefined, lte: maxPrice || undefined } },
          {
            variants: {
              some: {
                price: {
                  gte: minPrice || undefined,
                  lte: maxPrice || undefined,
                },
              },
            },
          },
        ],
      });
    }

    // Apply Specification filters
    // This assumes product-level specifications as per your `Specification` model
    if (specifications && Object.keys(specifications).length > 0) {
      const specAttributeConditions = Object.entries(specifications).map(
        ([attribute, values]) => ({
          specifications: {
            some: {
              // 'some' means at least one specification must match the attribute AND one of its values
              AND: [{ attribute: attribute }, { values: { hasSome: values } }],
            },
          },
        })
      );
      // Combine all attribute filters with AND
      andConditions.push({ AND: specAttributeConditions });
    }

    // Apply Popularity Filter
    if (popularityRanges && popularityRanges.length > 0) {
      const popularityConditions = popularityRanges.map((range: string) => {
        // Explicitly type 'range'
        if (range === "Below5.0") {
          return { popularityScore: { lt: 5.0 } };
        }
        const minScore = parseFloat(range);
        return { popularityScore: { gte: minScore } };
      });
      andConditions.push({ OR: popularityConditions });
    }

    // Apply Rating Filter
    if (ratings && ratings.length > 0) {
      const ratingConditions = ratings.map((minRatingStr: string) => {
        // Explicitly type 'minRatingStr'
        const minRating = parseFloat(minRatingStr);
        return {
          averageRating: { gte: minRating },
        };
      });
      andConditions.push({ OR: ratingConditions });
    }

    // Combine the static whereClause with dynamically generated AND conditions
    if (andConditions.length > 0) {
      whereClause.AND = [
        ...(Array.isArray(whereClause.AND)
          ? whereClause.AND
          : whereClause.AND
            ? [whereClause.AND]
            : []),
        ...andConditions,
      ];
    }

    const rawProducts = await db.product.findMany({
      where: whereClause,
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
