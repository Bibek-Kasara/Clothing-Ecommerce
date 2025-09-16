import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/product-grid';
import { FilterSidebar, type FilterState } from '@/components/filters/filter-sidebar';
import { SortDropdown, type SortOption } from '@/components/ui/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SalePage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    sizes: [],
    onSale: true, // Always true for sale page
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000,
  });

  // Only discounted items
  const saleProducts = useMemo(
    () =>
      allProducts.filter((p) => p.onSale && p.discountPercentage > 0),
    [allProducts]
  );

  // Apply filters & sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = saleProducts.filter((product) => {
      // Price filter (use discounted price for comparison)
      const finalPrice = product.price * (1 - product.discountPercentage / 100);
      if (
        finalPrice < filters.priceRange[0] ||
        finalPrice > filters.priceRange[1]
      ) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (
        filters.sizes.length > 0 &&
        !filters.sizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }

      return true;
    });

    // Sort without mutating filtered order reference
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low': {
        sorted.sort((a, b) => {
          const pa = a.price * (1 - a.discountPercentage / 100);
          const pb = b.price * (1 - b.discountPercentage / 100);
          return pa - pb;
        });
        break;
      }
      case 'price-high': {
        sorted.sort((a, b) => {
          const pa = a.price * (1 - a.discountPercentage / 100);
          const pb = b.price * (1 - b.discountPercentage / 100);
          return pb - pa;
        });
        break;
      }
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "newest" – no createdAt in DummyJSON, so show highest discount first as a meaningful default
        sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return sorted;
  }, [saleProducts, filters, sortBy]);

  const availableBrands = useMemo(() => {
    const brands = new Set(saleProducts.map((p) => p.brand));
    return Array.from(brands).sort();
  }, [saleProducts]);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  const averageDiscount = useMemo(() => {
    if (saleProducts.length === 0) return 0;
    const total = saleProducts.reduce(
      (sum, p) => sum + p.discountPercentage,
      0
    );
    return Math.round(total / saleProducts.length);
  }, [saleProducts]);

  const maxDiscount = saleProducts.length
    ? Math.max(...saleProducts.map((p) => p.discountPercentage))
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Sale Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#FF8A65] to-[#6B4EFF] rounded-2xl p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Sale Collection</h1>
          </div>
          <p className="text-xl mb-4">Up to {maxDiscount}% Off</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {saleProducts.length} Items on Sale
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Average {averageDiscount}% Off
            </Badge>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <p className="text-slate-600">
            {filteredAndSortedProducts.length} sale items found
          </p>
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
                      <span className="ml-2 w-2 h-2 bg-[#6B4EFF] rounded-full" />
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
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Active Filters:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filters.brands.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full"
                    >
                      Brand: {brand}
                    </span>
                  ))}
                  {filters.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full"
                    >
                      Size: {size}
                    </span>
                  ))}
                  {(filters.priceRange[0] > 0 ||
                    filters.priceRange[1] < 1000) && (
                    <span className="px-2 py-1 bg-[#6B4EFF] text-white text-xs rounded-full">
                      NPR {Math.round(filters.priceRange[0] * 133)} - NPR{' '}
                      {Math.round(filters.priceRange[1] * 133)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredAndSortedProducts}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
