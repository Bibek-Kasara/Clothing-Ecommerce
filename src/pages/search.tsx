import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/lib/api';
import { searchAndFilterProducts } from '@/lib/search';
import { ProductGrid } from '@/components/product/product-grid';
import { FilterSidebar, type FilterState } from '@/components/filters/filter-sidebar';
import { SortDropdown, type SortOption } from '@/components/ui/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Filter, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
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

  // Search products
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAndFilterProducts(allProducts, searchQuery);
  }, [allProducts, searchQuery]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = searchResults.filter((product) => {
      // Price filter
      const finalPrice = product.onSale
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
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

      // Sale filter
      if (filters.onSale && !product.onSale) {
        return false;
      }

      return true;
    });

    // Sort without mutating filtered reference
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => {
          const pa = a.onSale ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const pb = b.onSale ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return pa - pb;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const pa = a.onSale ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const pb = b.onSale ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return pb - pa;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        sorted.sort((a, b) => b.id - a.id);
    }

    return sorted;
  }, [searchResults, filters, sortBy]);

  const availableBrands = useMemo(() => {
    const brands = new Set(searchResults.map((p) => p.brand));
    return Array.from(brands).sort();
  }, [searchResults]);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.onSale ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for shirt, pant, kurti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6B4EFF] hover:bg-[#5A3FE7]"
              >
                Search
              </Button>
            </div>
          </form>

          {initialQuery && (
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Search Results
              </h1>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-slate-600">Showing results for</span>
                <Badge variant="secondary" className="bg-[#6B4EFF]/10 text-[#6B4EFF]">
                  "{initialQuery}"
                </Badge>
                <span className="text-slate-600">
                  ({filteredAndSortedProducts.length} products found)
                </span>
              </div>
            </div>
          )}
        </div>

        {!initialQuery ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Search for Products
            </h2>
            <p className="text-slate-600">
              Enter keywords like "shirt", "pant", "kurti", or "watch" to find products
            </p>
          </div>
        ) : (
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
              <ProductGrid
                products={filteredAndSortedProducts}
                isLoading={isLoading}
                error={error}
              />

              {/* No Results */}
              {!isLoading && searchQuery && filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    No Results Found
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Try searching with different keywords or adjust your filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        priceRange: [0, 1000],
                        brands: [],
                        sizes: [],
                        onSale: false,
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
