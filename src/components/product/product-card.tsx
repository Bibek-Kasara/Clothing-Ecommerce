import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toNPR, calculateDiscount } from '@/lib/currency';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addItem);

  const { discountedPrice } = calculateDiscount(
    product.price,
    product.discountPercentage
  );
  const finalPriceUsd = product.onSale ? discountedPrice : product.price;

  // USD->NPR (use same env as toNPR)
  const rate = Number(import.meta.env.VITE_USD_TO_NPR) || 133;
  const amtNpr = Math.round(finalPriceUsd * rate);

  const handleBuyNow = () => {
    // choose first available size to keep the flow simple from the card
    const defaultSize = product.sizes?.[0];
    if (!defaultSize) {
      toast({ title: 'Please select a size on the product page', variant: 'destructive' });
      navigate(`/product/${product.id}`);
      return;
    }
    // add one piece to cart (optional), then redirect to eSewa
    addToCart(product, defaultSize, 1);
    navigate(`/pay/esewa?pid=${encodeURIComponent('PRD-' + product.id)}&amt=${amtNpr}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-square w-full overflow-hidden bg-slate-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        {/* HOVER BUTTONS INSIDE IMAGE */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 space-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <Button
            onClick={handleBuyNow}
            className="w-full bg-[#FF8A65] text-white hover:bg-[#e2724e] shadow-sm"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Buy Now
          </Button>

          <Button asChild className="w-full bg-[#6B4EFF] text-white hover:bg-[#5A3FE7] shadow-sm">
            <Link to={`/product/${product.id}`}>Quick Add</Link>
          </Button>
        </div>
      </div>

      {/* TEXT */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-1 font-semibold text-slate-800 hover:text-[#6B4EFF]"
        >
          {product.title}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">
            {toNPR(finalPriceUsd)}
          </span>
          {product.onSale && (
            <span className="text-sm text-slate-400 line-through">
              {toNPR(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
