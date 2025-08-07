/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const invoiceSchema = z.object({
  companyName: z.string().optional(),
  tinId: z.string().optional(),
  addressId: z.string().cuid(),
});

async function getAuthUser() {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await (await supabase).auth.getSession();

  if (sessionError || !session) {
    return {
      error: NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      ),
    };
  }

  const supabaseUserId = session.user.id;
  const user = await db.user.findUnique({
    where: { authId: supabaseUserId },
    select: { id: true },
  });

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      ),
    };
  }

  return { user };
}

// GET route to fetch the user's invoice info
export async function GET(request: Request) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const invoice = await db.invoiceInfo.findFirst({
      where: { userId: user.id },
      include: {
        address: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoiceInfo:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching invoiceInfo.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// POST route to create new invoice info
export async function POST(request: Request) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const validatedBody = invoiceSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid request data.",
          errors: validatedBody.error.format(),
        },
        { status: 400 }
      );
    }

    const { companyName, tinId, addressId } = validatedBody.data;

    // Check if the user already has an invoice info record
    const existingInvoice = await db.invoiceInfo.findFirst({
      where: { userId: user.id },
    });

    if (existingInvoice) {
      return NextResponse.json(
        {
          message:
            "User already has an invoice info record. Use PUT to update.",
          code: "CONFLICT",
        },
        { status: 409 }
      );
    }

    // Create a new invoice info record
    const newInvoice = await db.invoiceInfo.create({
      data: {
        userId: user.id,
        companyName: companyName,
        tinId: tinId,
        addressId: addressId,
        invoiceNo:
          "INV-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newInvoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding invoice info:", error);
    return NextResponse.json(
      {
        message: "An error occurred while adding the invoice info.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// PUT route to update an existing invoice info record
export async function PUT(request: Request) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const validatedBody = invoiceSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid request data.",
          errors: validatedBody.error.format(),
        },
        { status: 400 }
      );
    }

    const { companyName, tinId, addressId } = validatedBody.data;

    // Find the existing invoice info record
    const existingInvoice = await db.invoiceInfo.findFirst({
      where: { userId: user.id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        {
          message:
            "Invoice info not found for this user. Use POST to create one.",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Update the existing record
    const updatedInvoice = await db.invoiceInfo.update({
      where: { id: existingInvoice.id },
      data: {
        companyName: companyName,
        tinId: tinId,
        addressId: addressId,
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedInvoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invoice info:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the invoice info.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
