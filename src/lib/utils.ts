import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DiscountInfo,
  PasswordRequirements,
  ProductWithProps,
  SpecificationWithProps,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkPasswordRequirements = (
  password: string,
  setPasswordRequirements: (requirements: PasswordRequirements) => void
) => {
  const requirements: PasswordRequirements = {
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isValidLength: password.length >= 6 && password.length <= 20,
  };

  setPasswordRequirements(requirements);
};

export const productType = (category: string) => {
  if (category === "food-beverages") {
    return "Food";
  } else if (category.includes("services")) {
    return "Service";
  } else {
    return "NonFood";
  }
};

export const formatAttributeName = (attribute: string) => {
  return attribute
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/\b\w/g, (str) => str.toUpperCase()); // Capitalize first letter of each word
};

export const filterSpecificationsByCategory = (
  specs: SpecificationWithProps[],
  category: string
) => {
  const productType =
    category === "food-beverages"
      ? "Food"
      : category.includes("services")
        ? "Service"
        : "NonFood";

  return specs.filter((spec) => {
    // If it's a food category, only show food-related specs
    if (productType === "Food") {
      return (
        spec.attribute.toLowerCase().includes("beverage") ||
        spec.attribute.toLowerCase().includes("food") ||
        spec.attribute.toLowerCase().includes("size")
      );
    }
    // If it's a non-food category, exclude food-related specs
    else if (productType === "NonFood") {
      return (
        !spec.attribute.toLowerCase().includes("beverage") &&
        !spec.attribute.toLowerCase().includes("food")
      );
    }
    // For services, show all or customize as needed
    return true;
  });
};

export const calculateDiscountPrice = (
  originalPrice: number,
  discounts: DiscountInfo[]
) => {
  let finalPrice = originalPrice;
  let totalPercentageDiscount = 0;
  let totalFixedDiscount = 0;

  discounts.forEach((discount) => {
    if (discount.discountType === "Percentage Off") {
      totalPercentageDiscount += discount.value;
    } else if (discount.discountType === "Fixed Price") {
      totalFixedDiscount += discount.value;
    }
  });

  // Apply percentage discount first
  if (totalPercentageDiscount > 0) {
    finalPrice = finalPrice * (1 - totalPercentageDiscount / 100);
  }

  // Then apply fixed discount
  if (totalFixedDiscount > 0) {
    finalPrice = Math.max(0, finalPrice - totalFixedDiscount);
  }

  return finalPrice;
};

/**
 * Formats text by replacing hyphens with spaces and capitalizing each word
 * @param text - The input string to format (can be undefined or null)
 * @returns Formatted string with spaces and proper capitalization
 */
export const formatText = (text: string | undefined | null): string => {
  if (!text) return "";

  return text
    .replace(/-/g, " ") // Replace all hyphens with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Formats discount date range in "MONTH DD-DD" format (e.g. "JULY 04-08")
 * @param startDate ISO date string
 * @param endDate ISO date string
 * @returns Formatted date range string
 */
export function formatDiscountDateRange(
  startDate: string,
  endDate: string
): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    // Check if dates are in the same month
    if (
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    ) {
      // If different months, show full date range
      return `${start.toLocaleString("default", { month: "long" })} ${start.getDate()} - ${end.toLocaleString("default", { month: "long" })} ${end.getDate()}`;
    }

    // Same month - format as "MONTH DD-DD"
    return `${start.toLocaleString("default", { month: "long" }).toUpperCase()} ${start.getDate()}-${end.getDate()}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "Discount Period";
  }
}

export const getDiscountInfo = (product: ProductWithProps) => {
  const discounts: DiscountInfo[] = [];
  // Check new arrival discount
  if (
    product.newArrivalDiscount &&
    product.newArrivalDiscount.status === "Ongoing"
  ) {
    discounts.push({
      type: "new-arrival",
      value: product.newArrivalDiscount.value,
      text: product.newArrivalDiscount.discount,
      discountType: product.newArrivalDiscount.type, // 'percentage' or 'fixed'
    });
  }

  // Check product discount
  if (product.productDiscount && product.productDiscount.status === "Ongoing") {
    discounts.push({
      type: "product",
      value: product.productDiscount.value,
      text: product.productDiscount.discount,
      discountType: product.productDiscount.type, // 'percentage' or 'fixed'
    });
  }

  return discounts;
};

export const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : time.toString();
};

export const getTimeSinceListing = (product: ProductWithProps) => {
  if (!product.createdAt) return "";
  const now = new Date();
  const createdDate = new Date(product.createdAt);
  const diffInDays = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Listed in last 24 hours";
  if (diffInDays === 1) return "Listed yesterday";
  if (diffInDays < 7) return `Listed in last ${diffInDays} days`;
  if (diffInDays < 30)
    return `Listed in last ${Math.floor(diffInDays / 7)} weeks`;
  return `Listed in last ${Math.floor(diffInDays / 30)} months`;
};

export const getInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return (firstInitial + lastInitial).trim();
};

export const maskEmail = (email: string | null | undefined): string => {
  if (!email) {
    return "";
  }

  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    return email;
  }

  const username = email.substring(0, atIndex);
  const domain = email.substring(atIndex);

  if (username.length <= 2) {
    return username.charAt(0) + "*".repeat(username.length - 1) + domain;
  }

  const maskedUsername =
    username.substring(0, 2) + "*".repeat(username.length - 2);

  return maskedUsername + domain;
};
