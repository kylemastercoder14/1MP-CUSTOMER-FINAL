/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

export async function GET(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(
      { success: true, data: addresses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching addresses.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const body = await request.json();
    let {
      fullName,
      contactNumber,
      homeAddress,
      barangay,
      city,
      province,
      region,
      zipCode,
      type,
      isDefault,
    } = body;

    // Basic validation
    if (
      !fullName ||
      !contactNumber ||
      !homeAddress ||
      !barangay ||
      !city ||
      !province ||
      !region ||
      !zipCode ||
      !type
    ) {
      return NextResponse.json(
        {
          message: "All required address fields must be provided.",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // If the new address is set as default, unset all other default addresses for this user
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    } else {
      // If no default address exists yet, make the first one default
      const existingDefault = await db.address.count({
        where: { userId: user.id, isDefault: true },
      });
      if (existingDefault === 0) {
        isDefault = true;
      }
    }

    const newAddress = await db.address.create({
      data: {
        userId: user.id,
        fullName,
        contactNumber,
        homeAddress,
        barangay,
        city,
        province,
        region,
        zipCode,
        type,
        isDefault: isDefault || false, // Ensure it's boolean
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully!",
        data: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      {
        message: "An error occurred while adding the address.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// You'll also need PUT for updating and DELETE for removing addresses
// For PUT (updating an existing address)
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

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      id,
      fullName,
      contactNumber,
      homeAddress,
      barangay,
      city,
      province,
      region,
      zipCode,
      type,
      isDefault,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Address ID is required for update.", code: "MISSING_ID" },
        { status: 400 }
      );
    }

    // Ensure the address belongs to the user
    const existingAddress = await db.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Address not found or unauthorized.",
          code: "UNAUTHORIZED_ADDRESS",
        },
        { status: 403 }
      );
    }

    // If setting this address as default, unset others
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: {
        fullName,
        contactNumber,
        homeAddress,
        barangay,
        city,
        province,
        region,
        zipCode,
        type,
        isDefault: isDefault,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully!",
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the address.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// For DELETE (removing an address)
export async function DELETE(request: Request) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { userId } = await useUser();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found.", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const { id } = await request.json(); // Expecting address ID in body for DELETE

    if (!id) {
      return NextResponse.json(
        { message: "Address ID is required for deletion.", code: "MISSING_ID" },
        { status: 400 }
      );
    }

    // Ensure the address belongs to the user before deleting
    const addressToDelete = await db.address.findUnique({
      where: { id },
    });

    if (!addressToDelete || addressToDelete.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Address not found or unauthorized.",
          code: "UNAUTHORIZED_ADDRESS",
        },
        { status: 403 }
      );
    }

    await db.address.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Address deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the address.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
