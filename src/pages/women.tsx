import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/product-grid';
import { FilterSidebar, type FilterState } from '@/components/filters/filter-sidebar';
import { SortDropdown, type SortOption } from '@/components/ui/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function WomenPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    sizes: [],
    onSale: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Clothing-only categories for Women page
  // If you also want to include women's shoes, add 'womens-shoes' to this list.
  const WOMEN_CLOTHING_CATEGORIES = new Set(['womens-dresses', 'tops']);

  // ✅ Only clothing items; do NOT use gender === 'women' (that pulls accessories too)
  const womenProducts = useMemo(() => {
    return allProducts.filter((p) => WOMEN_CLOTHING_CATEGORIES.has(p.category));
  }, [allProducts]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = womenProducts.filter((product) => {
      // Price filter
      const finalPrice = product.onSale
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some((size) => product.sizes.includes(size))) {
        return false;
      }

      // Sale filter
      if (filters.onSale && !product.onSale) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low': {
        filtered.sort((a, b) => {
          const priceA = a.onSale ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.onSale ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceA - priceB;
        });
        break;
      }
      case 'price-high': {
        filtered.sort((a, b) => {
          const priceA = a.onSale ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.onSale ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceB - priceA;
        });
        break;
      }
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [womenProducts, filters, sortBy]);

  const availableBrands = useMemo(() => {
    const brands = new Set(womenProducts.map((p) => p.brand));
    return Array.from(brands).sort();
  }, [womenProducts]);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.onSale ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Women&apos;s Wear
          </h1>
          <p className="text-slate-600">{filteredAndSortedProducts.length} products found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                availableBrands={availableBrands}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 w-2 h-2 bg-[#6B4EFF] rounded-full"></span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableBrands={availableBrands}
                  />
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {filters.brands.map((brand) => (
                    <span key={brand} className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full">
                      Brand: {brand}
                    </span>
                  ))}
                  {filters.sizes.map((size) => (
                    <span key={size} className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full">
                      Size: {size}
                    </span>
                  ))}
                  {filters.onSale && (
                    <span className="px-2 py-1 bg-[#FF8A65] text-white text-xs rounded-full">
                      On Sale
                    </span>
                  )}
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                    <span className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full">
                      NPR {Math.round(filters.priceRange[0] * 133)} - NPR {Math.round(filters.priceRange[1] * 133)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid products={filteredAndSortedProducts} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
