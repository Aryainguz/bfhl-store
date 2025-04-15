"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductFilters from "@/components/product-filters";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductStore } from "@/hooks/useProductsStore";

export default function ProductsPage() {
  const searchParams:any = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    products,
    filteredProducts,
    setFilteredProducts,
    fetchProducts,
  } = useProductStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 2000] as [number, number],
    ratings: [] as number[],
  });

  // Fetch products on mount if empty
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  // Update local search query from URL parameters on mount and whenever products update
  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    setSearchQuery(querySearch);
    applyFilters(querySearch);
  }, [searchParams, products]);

  // Debounced realtime search: update filtering and URL on every search query change
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      applyFilters(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, router, pathname, products]);

  // Debounce filter changes so that rapid double clicks don't apply filters immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeFilters, products]);

  const applyFilters = (query: string = searchQuery) => {
    let results = [...products];

    // Search Filter
    if (query) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category Filter
    if (activeFilters.categories.length > 0) {
      results = results.filter((product) =>
        activeFilters.categories.includes(product.category)
      );
    }

    // Price Range Filter
    results = results.filter(
      (product) =>
        product.price >= activeFilters.priceRange[0] &&
        product.price <= activeFilters.priceRange[1]
    );

    // Rating Filter
    if (activeFilters.ratings.length > 0) {
      results = results.filter((product) =>
        activeFilters.ratings.some((rating) => product.rating >= rating)
      );
    }

    setFilteredProducts(results);
  };

  // When filter controls change, only update activeFilters; filtering is handled by useEffect debounce
  const handleFilterChange = (filters: {
    categories: string[];
    priceRange: [number, number];
    ratings: number[];
  }) => {
    setActiveFilters(filters);
  };

  // Clear search action
  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    applyFilters("");
  };

  const minPrice = products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 2000;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Browse through our extensive collection of products.
          </p>
        </div>

        {/* Realtime Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 pr-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>
              <ProductFilters
                categories={[...new Set(products.map((p) => p.category))]}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <ProductFilters
                    categories={[...new Set(products.map((p) => p.category))]}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
