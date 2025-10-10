import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { useUser } from "@/hooks/use-user";

export async function PUT(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const username = formData.get("username") as string | null;
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const gender = formData.get("gender") as string | null;
    const dateOfBirth = formData.get("dateOfBirth") as string | null;

    // Fetch the existing customer from your DB
    const customer = await db.user.findUnique({
      where: { id: userId },
    });

    if (!customer) {
      return NextResponse.json(
        {
          message: "Customer profile not found in database.",
          code: "CUSTOMER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Prepare data for update (without image)
    const updateData: Prisma.UserUpdateInput = {
      ...(customer.username === null && username ? { username: username } : {}),
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      gender: gender,
      dateOfBirth: dateOfBirth,
    };

    const updatedCustomer = await db.user.update({
      where: { id: customer.id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully!",
        data: updatedCustomer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer profile (text fields):", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating profile text fields.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
