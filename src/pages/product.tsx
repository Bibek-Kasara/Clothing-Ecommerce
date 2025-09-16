import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { fetchProductById } from '@/lib/api';
import { toNPR, calculateDiscount } from '@/lib/currency';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  });

  const addToCart = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(Number(id)));
  const { addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const { discountedPrice, savings } = calculateDiscount(product.price, product.discountPercentage);
  const finalPrice = product.onSale ? discountedPrice : product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }

    addToCart(product, selectedSize, quantity);
    toast({
      title: 'Added to cart',
      description: `${product.title} (Size ${selectedSize}) added to cart`,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: 'Removed from wishlist' });
    } else {
      addToWishlist(product.id);
      toast({ title: 'Added to wishlist' });
    }
  };

  const handleBuyNow = () => {
    // Logic for Buy Now (can navigate to checkout or cart page)
    if (!selectedSize) {
      toast({ title: 'Please select a size and quantity', variant: 'destructive' });
      return;
    }
    navigate(`/checkout/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 border-slate-300 bg-white text-slate-900 hover:bg-slate-900 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-[500px] mx-auto overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex content-center gap-2 max-w-[520px] mx-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'aspect-square h-16 overflow-hidden rounded-md bg-slate-100 border-2 transition-colors',
                      selectedImage === index ? 'border-[#6B4EFF]' : 'border-transparent hover:border-slate-300'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn('h-5 w-5', i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300')}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {product.rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 10} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-800">{toNPR(finalPrice)}</span>
                {product.onSale && (
                  <>
                    <span className="text-xl text-slate-500 line-through">{toNPR(product.price)}</span>
                    <Badge className="bg-[#FF8A65] text-white">
                      -{Math.round(product.discountPercentage)}%
                    </Badge>
                  </>
                )}
              </div>
              {product.onSale && <p className="text-sm text-green-600">You save {toNPR(savings)}</p>}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2 max-w-xs">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'py-3 px-4 border rounded-lg font-medium transition-colors',
                      selectedSize === size
                        ? 'border-[#6B4EFF] bg-[#6B4EFF] text-white'
                        : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Quantity</h3>
              <div className="flex items-center gap-3 max-w-xs">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <span className="px-4 py-2 border rounded-lg">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="bg-[#6B4EFF] hover:bg-[#5A3FE7] text-white"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                >
                  <Heart
                    className={cn('h-5 w-5 mr-2', isInWishlist ? 'fill-red-500 text-red-500' : '')}
                  />
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>

                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  disabled={!selectedSize}
                  className="bg-[#6B4EFF] hover:bg-[#5A3FE7] text-white"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[#6B4EFF]" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-slate-600">On orders over NPR 6,650</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-[#6B4EFF]" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-slate-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#6B4EFF]" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-slate-600">100% secure checkout</p>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock > 0 ? (
              <div className="text-green-600 text-sm">✓ In Stock ({product.stock} items available)</div>
            ) : (
              <div className="text-red-600 text-sm">✗ Out of Stock</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
