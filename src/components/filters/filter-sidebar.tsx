import { useState } from 'react';
import { X } from 'lucide-react';

import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toNPR } from '@/lib/currency';
import type { ProductSize } from '@/types/product';

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  sizes: ProductSize[];
  onSale: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableBrands: string[];
  className?: string;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  availableBrands,
  className,
}: FilterSidebarProps) {
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(
    filters.priceRange
  );

  // ——— handlers ———
  const handlePriceRangeChange = (values: number[]) => {
    const next: [number, number] = [values[0], values[1]];
    setTempPriceRange(next);
    onFiltersChange({ ...filters, priceRange: next });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const next = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    onFiltersChange({ ...filters, brands: next });
  };

  const handleSizeChange = (size: ProductSize, checked: boolean) => {
    const next = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter((s) => s !== size);
    onFiltersChange({ ...filters, sizes: next });
  };

  const clearFilters = () => {
    const defaults: FilterState = {
      priceRange: [0, 1000],
      brands: [],
      sizes: [],
      onSale: false,
    };
    onFiltersChange(defaults);
    setTempPriceRange(defaults.priceRange);
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.onSale ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      {/* Header + Clear */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>

        {hasActiveFilters && (
          <Button
            // initial: white bg, black border/text; hover: invert
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="rounded-xl border border-slate-900 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Price Range</Label>

        <div className="px-1">
          {/* Your Slider component already uses black track + white range/knob (we’ll invert per your latest Slider.tsx) */}
          <Slider
            value={tempPriceRange}
            onValueChange={handlePriceRangeChange}
            min={0}
            max={1000}
            step={10}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-600">
            <span>{toNPR(tempPriceRange[0])}</span>
            <span>{toNPR(tempPriceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Brands — single custom-scrolled list (no nested scrollers) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Brand</Label>

        <div
          className="brand-scroll max-h-44 overflow-y-auto space-y-2 pr-1"
          style={{
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: '#94A3B8 #FFFFFF', // thumb / track
          }}
        >
          {/* WebKit (Chrome/Edge/Safari) custom scrollbars */}
          <style>{`
            .brand-scroll::-webkit-scrollbar { width: 8px; }
            .brand-scroll::-webkit-scrollbar-track { background: #ffffff; border-radius: 9999px; }
            .brand-scroll::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 9999px; }
            .brand-scroll::-webkit-scrollbar-thumb:hover { background: #64748B; }
          `}</style>

          {availableBrands.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                htmlFor={`brand-${brand}`}
                className="flex cursor-pointer items-center gap-2"
              >
                {/* keep checkbox for a11y/state; visually use the pill */}
                <Checkbox
                  id={`brand-${brand}`}
                  checked={checked}
                  onCheckedChange={(c) => handleBrandChange(brand, !!c)}
                  className="sr-only"
                />
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1.5 text-[13px] transition-colors
                    ${
                      checked
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sizes — pill style, white -> invert when active */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Size</Label>

        <div className="grid grid-cols-4 gap-2">
          {(['S', 'M', 'L', 'XL'] as ProductSize[]).map((size) => {
            const checked = filters.sizes.includes(size);
            return (
              <label
                key={size}
                htmlFor={`size-${size}`}
                className="flex items-center justify-center"
              >
                <Checkbox
                  id={`size-${size}`}
                  checked={checked}
                  onCheckedChange={(c) => handleSizeChange(size, !!c)}
                  className="sr-only"
                />
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors
                    ${
                      checked
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  {size}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Special Offers — pill toggle */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Special Offers</Label>

        <label htmlFor="sale-items" className="inline-flex cursor-pointer items-center gap-2">
          <Checkbox
            id="sale-items"
            checked={filters.onSale}
            onCheckedChange={(c) => onFiltersChange({ ...filters, onSale: !!c })}
            className="sr-only"
          />
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1.5 text-[13px] transition-colors
              ${
                filters.onSale
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
              }`}
          >
            Sale Items Only
          </span>
        </label>
      </div>
    </div>
  );
}
