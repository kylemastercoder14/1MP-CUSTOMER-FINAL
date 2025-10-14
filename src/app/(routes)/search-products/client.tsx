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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Columns2, Grid2X2, TableProperties, XCircle } from "lucide-react";
import { SubCategory } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { SpecificationWithProps } from "@/types";
import {
  calculateDiscountPrice,
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
import { Button } from "@/components/ui/button";

const Client = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const categories = searchParams.get("categories") || "";
  const initialSubcategoriesFromUrl = searchParams.get("subcategories") || "";

  // Category filter state
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialSubcategoriesFromUrl ? [initialSubcategoriesFromUrl] : []
  );
  // Specification filter state (e.g., { "Color": ["Red", "Blue"], "Size": ["M"] })
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    Record<string, string[]>
  >({});
  // Price filter state
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  // Popularity filter state
  const [selectedPopularityRanges, setSelectedPopularityRanges] = useState<
    string[]
  >([]);
  // Rating filter state (assuming similar structure to popularity filter, e.g., minimum star rating)
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

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

  const updateUrl = useCallback(
    (newSubcategory: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries())); // Get current params

      if (newSubcategory) {
        current.set("subcategories", newSubcategory);
      } else {
        current.delete("subcategories"); // Remove if null
      }

      // Preserve existing category filter
      if (categories) {
        current.set("categories", categories);
      } else {
        current.delete("categories"); // Or handle as needed if category can be cleared
      }

      const query = current.toString();
      router.push(`${pathname}?${query}`);
    },
    [router, pathname, searchParams, categories]
  );

  // Function to reset all filters
  const handleResetFilters = useCallback(() => {
    // Reset subcategories (to initial URL value or empty if no URL param)
    setSelectedSubcategories([]);
    updateUrl(null);
    setSelectedSpecifications({});
    setMinPrice(null);
    setMaxPrice(null);
    setSelectedPopularityRanges([]);
    setSelectedRatings([]);
    setSortBy("Best seller");
  }, [updateUrl]);

  // Group specifications by attribute
  const groupedSpecifications = specifications.reduce(
    (acc: Record<string, string[]>, spec) => {
      if (!acc[spec.attribute]) {
        acc[spec.attribute] = [];
      }

      const uniqueValuesForAttribute = new Set([
        ...acc[spec.attribute],
        ...spec.values,
      ]);
      acc[spec.attribute] = Array.from(uniqueValuesForAttribute);

      return acc;
    },
    {}
  );

  // Callback for CategoryFilter
  const handleSubcategoryChange = useCallback(
    (slug: string, isChecked: boolean) => {
      let newSelectedSubcategories: string[];
      if (isChecked) {
        // If checked, always set to the new slug (single selection)
        newSelectedSubcategories = [slug];
        updateUrl(slug); // Update URL with the newly selected subcategory
      } else {
        // If unchecked, clear selection (and URL param) only if it was the one selected
        if (selectedSubcategories.includes(slug)) {
          newSelectedSubcategories = [];
          updateUrl(null); // Remove subcategories from URL
        } else {
          newSelectedSubcategories = selectedSubcategories; // No change if unchecking something not selected
        }
      }
      setSelectedSubcategories(newSelectedSubcategories);
    },
    [selectedSubcategories, updateUrl]
  );

  // Callback for SpecificationFilter
  const handleSpecificationChange = useCallback(
    (attribute: string, value: string, isChecked: boolean) => {
      setSelectedSpecifications((prev) => {
        const newSpecs = { ...prev };
        if (isChecked) {
          newSpecs[attribute] = [...(newSpecs[attribute] || []), value];
        } else {
          newSpecs[attribute] = (newSpecs[attribute] || []).filter(
            (v) => v !== value
          );
          if (newSpecs[attribute].length === 0) {
            delete newSpecs[attribute];
          }
        }
        return newSpecs;
      });
    },
    []
  );

  // Callback for PriceFilter
  const handlePriceRangeChange = useCallback(
    (min: number | null, max: number | null) => {
      setMinPrice(min);
      setMaxPrice(max);
    },
    []
  );

  // Callback for PopularityFilter
  const handlePopularityChange = useCallback(
    (value: string, isChecked: boolean) => {
      setSelectedPopularityRanges((prev) => {
        if (isChecked) {
          // Assuming you want to select multiple popularity ranges
          return [...prev, value];
        } else {
          return prev.filter((v) => v !== value);
        }
      });
    },
    []
  );

  // Callback for RatingFilter (Placeholder, implement similarly)
  const handleRatingChange = useCallback(
    (value: string, isChecked: boolean) => {
      setSelectedRatings((prev) => {
        if (isChecked) {
          return [...prev, value];
        } else {
          return prev.filter((v) => v !== value);
        }
      });
    },
    []
  );

  // fetch products based on sort option
  const fetchProducts = async (
    sortOption = sortBy,
    currentCategories = categories,
    currentSelectedSubcategories = selectedSubcategories,
    currentSelectedSpecs = selectedSpecifications,
    currentMinPrice = minPrice,
    currentMaxPrice = maxPrice,
    currentPopularityRanges = selectedPopularityRanges,
    currentRatings = selectedRatings
  ) => {
    setProductLoading(true);
    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sortBy: sortOption,
          categories: currentCategories,
          subcategories: currentSelectedSubcategories,
          specifications: currentSelectedSpecs,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          popularityRanges: currentPopularityRanges,
          ratings: currentRatings,
        }),
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

    if (categories) {
      fetchSubCategories();
    }
    // Re-initialize selectedSubcategories when categories change (e.g., navigating from another category)
    setSelectedSubcategories(
      initialSubcategoriesFromUrl ? [initialSubcategoriesFromUrl] : []
    );
  }, [categories, initialSubcategoriesFromUrl]);

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

  // Main effect to trigger product fetching
  useEffect(() => {
    // Call fetchProducts with all current filter states
    fetchProducts(
      sortBy,
      categories,
      selectedSubcategories,
      selectedSpecifications,
      minPrice,
      maxPrice,
      selectedPopularityRanges,
      selectedRatings
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortBy,
    categories,
    selectedSubcategories,
    selectedSpecifications,
    minPrice,
    maxPrice,
    selectedPopularityRanges,
    selectedRatings,
  ]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case "grid4":
        return "lg:grid-cols-3 grid-cols-1";
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
      <div className="lg:px-80 px-10 pb-20 pt-[140px]">
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
            {selectedSubcategories.length > 0 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/search?categories=${categories}&subcategories=${selectedSubcategories[0]}`}
                      className="capitalize text-[#800020] hover:text-[#800020]"
                    >
                      {formatText(selectedSubcategories[0])}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
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
                  {formatText(
                    selectedSubcategories[0] ||
                      initialSubcategoriesFromUrl ||
                      categories ||
                      "All Products"
                  )}
                </h3>
                <p className="text-muted-foreground">
                  {productLoading ? (
                    <Skeleton className="inline-block w-20 h-4" />
                  ) : (
                    <span>{products.length}</span>
                  )}{" "}
                  items found for{" "}
                  <span className="font-medium">
                    &quot;
                    {formatText(
                      selectedSubcategories[0] ||
                        initialSubcategoriesFromUrl ||
                        categories ||
                        "All Products"
                    )}
                    &quot;
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                {/* --- Reset Filters Button --- */}
                {(selectedSubcategories.length > (initialSubcategoriesFromUrl ? 1 : 0) ||
                  Object.keys(selectedSpecifications).length > 0 ||
                  minPrice !== null ||
                  maxPrice !== null ||
                  selectedPopularityRanges.length > 0 ||
                  selectedRatings.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10 flex items-center gap-1"
                    onClick={handleResetFilters}
                  >
                    <XCircle className="size-4" />
                    Reset Filters
                  </Button>
                )}
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
                      <SelectItem value="Most popular">Most popular</SelectItem>
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
          <div className="lg:col-span-3">
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
                    selectedSubcategories={selectedSubcategories}
                    onSubcategoryChange={handleSubcategoryChange}
                  />
                  <h3 className="font-semibold text-base mb-3">
                    Specifications
                  </h3>
                  <SpecificationFilter
                    groupedSpecifications={groupedSpecifications}
                    specificationsLoading={specificationsLoading}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    selectedSpecifications={selectedSpecifications}
                    onSpecificationChange={handleSpecificationChange}
                  />
                  <h3 className="font-semibold text-base mb-3 mt-3">
                    Price Range
                  </h3>
                  <PriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceRangeChange={handlePriceRangeChange}
                  />
                  <h3 className="font-semibold text-base mb-3 mt-3">Rating</h3>
                  <RatingFilter
                    selectedRatings={selectedRatings}
                    onRatingChange={handleRatingChange}
                  />
                  <h3 className="font-semibold text-base mb-3 mt-3">
                    Popularity Score
                  </h3>
                  <PopularityFilter
                    selectedPopularityRanges={selectedPopularityRanges}
                    onPopularityChange={handlePopularityChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7">
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
                      subcategories={selectedSubcategories[0] || initialSubcategoriesFromUrl}
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
