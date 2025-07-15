import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const {
      vendorId,
      productId,
      limit = 4,
      filterBySubcategory,
      categorySlug,
    } = await request.json();

    if (!vendorId || !categorySlug) {
      return NextResponse.json(
        { error: "Vendor ID and Category Slug are required." },
        { status: 400 }
      );
    }

    const whereClause: Prisma.ProductWhereInput = {
      adminApprovalStatus: "Approved",
      vendorId: vendorId,
      categorySlug: categorySlug,
      NOT: productId ? { id: productId } : undefined,
    };

    if (filterBySubcategory) {
      const currentProduct = await db.product.findUnique({
        where: { id: productId },
        select: { subCategorySlug: true },
      });

      if (currentProduct?.subCategorySlug) {
        whereClause.subCategorySlug = currentProduct.subCategorySlug;
      } else {
        return NextResponse.json([]);
      }
    }

    const products = await db.product.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in recommended products route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
