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
