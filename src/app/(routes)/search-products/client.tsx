"use client";

import Header from "@/components/globals/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Columns2, Grid2X2, TableProperties } from "lucide-react";
import { SubCategory } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupedSpecifications, SpecificationWithProps } from "@/types";
import {
  calculateDiscountPrice,
  filterSpecificationsByCategory,
  formatText,
  getDiscountInfo,
} from "@/lib/utils";
import CategoryFilter from "@/components/globals/product-filter/category-filter";
import SpecificationFilter from "@/components/globals/product-filter/specification-filter";
import PriceFilter from "@/components/globals/product-filter/price-filter";
import RatingFilter from "@/components/globals/product-filter/rating-filter";
import PopularityFilter from "@/components/globals/product-filter/popularity-filter";
import { ProductWithProps } from "@/types";
import ProductCard from "@/components/globals/product-card";
import Footer from "@/components/globals/footer";

const Client = () => {
  const searchParams = useSearchParams();
  const categories = searchParams.get("categories") || "";
  const subcategories = searchParams.get("subcategories") || "";

  // toggle view more/view less
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visibleCount, setVisibleCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  // view toggle state
  const [viewMode, setViewMode] = useState<"grid4" | "grid2" | "grid1">(
    "grid4"
  );

  // sorting state
  const [sortBy, setSortBy] = useState("Best seller");
  const [products, setProducts] = useState<ProductWithProps[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // sub-categories states
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const visibleSubCategories = isExpanded
    ? subCategories
    : subCategories.slice(0, visibleCount);

  // specifications states
  const [specifications, setSpecifications] = useState<
    SpecificationWithProps[]
  >([]);
  const [specificationsLoading, setSpecificationsLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  // Group specifications by attribute
  const groupedSpecifications = specifications.reduce<GroupedSpecifications>(
    (acc, spec) => {
      // First filter by category
      const filteredSpecs = filterSpecificationsByCategory([spec], categories);
      if (filteredSpecs.length === 0) return acc;

      if (!acc[spec.attribute]) {
        acc[spec.attribute] = [];
      }
      acc[spec.attribute].push(spec);
      return acc;
    },
    {}
  );

  // fetch products based on sort option
  const fetchProducts = async (sortOption = sortBy) => {
    setProductLoading(true);
    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sortBy: sortOption }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductLoading(false);
    }
  };

  // Toggle group expansion
  const toggleGroup = (attribute: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [attribute]: !prev[attribute],
    }));
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await fetch(`/api/v1/sub-categories/${categories}`);
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        if (data.success) {
          setSubCategories(data.data);
        } else {
          console.error("Error fetching subcategories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchSubCategories();
  }, [categories]);

  useEffect(() => {
    const fetchSpecifications = async () => {
      setSpecificationsLoading(true);
      try {
        const response = await fetch(`/api/v1/specifications`);
        if (!response.ok) {
          throw new Error("Failed to fetch specifications");
        }
        const data = await response.json();
        if (data.success) {
          setSpecifications(data.data);
        } else {
          console.error("Error fetching specifications:", data.message);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      } finally {
        setSpecificationsLoading(false);
      }
    };

    fetchSpecifications();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case "grid4":
        return "lg:grid-cols-4 grid-cols-1";
      case "grid2":
        return "lg:grid-cols-2 grid-cols-1";
      case "grid1":
        return "grid-cols-1";
      default:
        return "lg:grid-cols-4 grid-cols-1";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
      </div>
      <div className="px-20 pb-20 pt-[140px]">
        <Breadcrumb>
          <BreadcrumbList className="text-base">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-[#800020] hover:text-[#800020]">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/components"
                  className="capitalize text-[#800020] hover:text-[#800020]"
                >
                  {formatText(categories)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/components"
                  className="capitalize text-[#800020] hover:text-[#800020]"
                >
                  {formatText(subcategories)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="mt-5 py-3 px-1 rounded-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-xl">
                  {formatText(subcategories)}
                </h3>
                <p className="text-muted-foreground">
                  3014 items found for{" "}
                  <span className="font-medium">
                    &quot;{formatText(subcategories)}&quot;
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      fetchProducts(value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Best seller">Best seller</SelectItem>
                      <SelectItem value="Price low to high">
                        Price low to high
                      </SelectItem>
                      <SelectItem value="Price high to low">
                        Price high to low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={viewMode}
                    onValueChange={(value: "grid4" | "grid2" | "grid1") => {
                      if (value) setViewMode(value);
                    }}
                  >
                    <ToggleGroupItem
                      value="grid4"
                      title="Grid view (4 items per row)"
                      aria-label="Toggle grid4"
                    >
                      <Grid2X2 className="size-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="grid2"
                      title="Grid view (2 items per row)"
                      aria-label="Toggle grid2"
                    >
                      <Columns2 className="size-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="grid1"
                      title="Grid view (1 item per row)"
                      aria-label="Toggle grid1"
                    >
                      <TableProperties className="size-5" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid mt-5 lg:grid-cols-10 grid-cols-1 gap-5">
          <div className="lg:col-span-2">
            <Card className="rounded-sm py-3 px-1">
              <CardContent>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-base mb-3">Categories</h3>
                  <CategoryFilter
                    categoryLoading={categoryLoading}
                    subCategories={subCategories}
                    visibleSubCategories={visibleSubCategories}
                    visibleCount={visibleCount}
                    toggleExpand={toggleExpand}
                    isExpanded={isExpanded}
                  />
                  <h3 className="font-semibold text-base mb-3">
                    Specifications
                  </h3>
                  <SpecificationFilter
                    groupedSpecifications={groupedSpecifications}
                    specificationsLoading={specificationsLoading}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                  />
                  <h3 className="font-semibold text-base mb-3 mt-3">
                    Price Range
                  </h3>
                  <PriceFilter />
                  <h3 className="font-semibold text-base mb-3 mt-3">Rating</h3>
                  <RatingFilter />
                  <h3 className="font-semibold text-base mb-3 mt-3">
                    Popularity Score
                  </h3>
                  <PopularityFilter />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <div className={`grid ${getGridClasses()} gap-4`}>
              {productLoading ? (
                // Show skeleton loaders while loading
                [...Array(12)].map((_, index) => (
                  <Card
                    key={index}
                    className={`bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 ${
                      viewMode === "grid1" ? "flex" : ""
                    }`}
                  >
                    <CardContent
                      className={`p-4 ${viewMode === "grid1" ? "flex gap-4 w-full" : ""}`}
                    >
                      {viewMode === "grid1" && (
                        <Skeleton className="h-40 w-40 rounded-md" />
                      )}
                      <div className={viewMode === "grid1" ? "flex-1" : ""}>
                        {viewMode !== "grid1" && (
                          <Skeleton className="h-40 w-full rounded-md mb-3" />
                        )}
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : products.length > 0 ? (
                // Show actual products
                products.map((product) => {
                  const price =
                    product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => v.price))
                      : product.price || 0;

                  const discounts = getDiscountInfo(product);
                  const hasDiscount = discounts.length > 0;
                  const discountPrice = calculateDiscountPrice(
                    price,
                    discounts
                  );

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      price={price}
                      discounts={discounts}
                      hasDiscount={hasDiscount}
                      viewMode={viewMode}
                      discountPrice={discountPrice}
                      categories={categories}
                      subcategories={subcategories}
                    />
                  );
                })
              ) : (
                // Show empty state if no products
                <div className="col-span-full text-center py-10">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Client;
