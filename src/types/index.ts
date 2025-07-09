import {
  Category,
  NewArrivalDiscount,
  Product,
  ProductVariant as PrismaProductVariant,
  Specification as PrismaSpecification,
  Specification,
  SubCategory,
  Vendor,
  ProductDiscount,
  NutritionalFact,
  PromoCode,
  Coupon,
} from "@prisma/client";
import {} from "@prisma/client";
import { TabItemType } from "@/components/globals/tabs-component";

export type PasswordRequirements = {
  hasNumber: boolean;
  hasLetter: boolean;
  hasSpecialChar: boolean;
  isValidLength: boolean;
};

export interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
}

export interface ProductWithCategory extends Product {
  category: Category;
  subCategory: SubCategory;
}

export interface SpecificationWithProps extends Specification {
  product: ProductWithCategory;
}

export interface GroupedSpecifications {
  [attribute: string]: SpecificationWithProps[];
}

export interface VendorWithPromotions extends Vendor {
  promoCode?: PromoCode[];
  coupon?: Coupon[];
}

export interface ProductWithProps extends Product {
  vendor: VendorWithPromotions;
  specifications: Specification[];
  variants: ProductVariant[];
  newArrivalDiscount?: NewArrivalDiscount | null;
  productDiscount?: ProductDiscount | null;
  category: Category | null;
  subCategory: SubCategory | null;
  nutritionalFacts?: NutritionalFact[];
}

export interface DiscountInfo {
  type: string; // 'new-arrival' or 'product'
  value: number;
  text?: string;
  discountType: string; // 'percentage' or 'fixed'
}

export type ProductTabType =
  | "Attributes"
  | "Reviews"
  | "Description"
  | "Policy";

export type ReportAbuseTabType =
  | "Product Violations"
  | "Order Disputes"
  | "Other Violations";

export type ReportAbuseTableTabType =
  | "Product related violations"
  | "Improper use of other people's information"
  | "Content violations"
  | "Order related violations"
  | "I received complaints from other users";

export type TabKey =
  | "My Account"
  | "Products"
  | "Store Issue"
  | "Order & Payment"
  | "After-Sales"
  | "Self-Service";

export const productTabs: TabItemType<ProductTabType>[] = [
  {
    index: 0,
    label: "Attributes",
    value: "Attributes",
  },
  {
    index: 1,
    label: "Reviews",
    value: "Reviews",
  },
  {
    index: 2,
    label: "Description",
    value: "Description",
  },
  {
    index: 3,
    label: "Policy",
    value: "Policy",
  },
];

export const reportAbuseTabs: TabItemType<ReportAbuseTabType>[] = [
  {
    index: 0,
    label: "Product Violations",
    value: "Product Violations",
  },
  {
    index: 1,
    label: "Order Disputes",
    value: "Order Disputes",
  },
  {
    index: 2,
    label: "Other Violations",
    value: "Other Violations",
  },
];

export const reportAbuseTableTabs: TabItemType<ReportAbuseTableTabType>[] = [
  {
    index: 0,
    label: "Product related violations",
    value: "Product related violations",
  },
  {
    index: 1,
    label: "Improper use of other people's information",
    value: "Improper use of other people's information",
  },
  {
    index: 2,
    label: "Content violations",
    value: "Content violations",
  },
  {
    index: 3,
    label: "Order related violations",
    value: "Order related violations",
  },
  {
    index: 4,
    label: "I received complaints from other users",
    value: "I received complaints from other users",
  },
];

// Properly type the variant attributes
export type VariantAttributes = Record<string, string> | null;

// Extend the Prisma ProductVariant with proper attributes typing
export interface ProductVariant
  extends Omit<PrismaProductVariant, "attributes"> {
  attributes: VariantAttributes;
}

// Type for specifications
export interface ProductSpecification
  extends Omit<PrismaSpecification, "values"> {
  values: string[];
}

// Props for the ProductVariants component
export interface ProductVariantsProps {
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  onVariantSelect?: (variant: ProductVariant | null) => void;
  selectedVariantId?: string | null;
  sizeGuide?: string | null;
}
