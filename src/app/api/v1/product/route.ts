import { NextResponse } from "next/server";
import db from "@/lib/db";

// The GET function handles GET requests to the /api/products endpoint.
export async function GET() {
  try {
    // Fetch all products from the database using Prisma.
    // The `findMany` method is used to retrieve multiple records.
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If successful, return the products in a JSON response with a 200 status code.
    // NextResponse is a built-in Next.js utility for creating API responses.
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    // If an error occurs, log it to the console for debugging.
    console.error("Error fetching products:", error);

    // Return an error response with a 500 status code.
    // It's good practice not to expose the full error message to the client.
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
