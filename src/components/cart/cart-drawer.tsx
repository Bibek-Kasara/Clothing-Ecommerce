import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { toNPR } from '@/lib/currency';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const navigate = useNavigate();
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal,
    clearCart
  } = useCartStore();
  const createOrder = useOrderStore(state => state.createOrder);

  const subtotalUSD = getSubtotal();
  const exchangeRate = Number(import.meta.env.VITE_USD_TO_NPR) || 133;
  const subtotalNPR = Math.round(subtotalUSD * exchangeRate);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    const order = createOrder(items, subtotalNPR);
    clearCart();
    closeCart();
    
    toast({
      title: "Order placed successfully!",
      description: `Order ${order.id} has been created.`
    });

    navigate('/orders');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-600 text-center">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map(item => {
                  const finalPrice = item.product.onSale
                    ? item.product.price * (1 - item.product.discountPercentage / 100)
                    : item.product.price;

                  return (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs text-slate-600">Size: {item.size}</p>
                        <p className="text-sm font-semibold text-[#6B4EFF]">{toNPR(finalPrice)}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => removeItem(item.product.id, item.size)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-[#6B4EFF]">
                  {toNPR(subtotalUSD)}
                </span>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-[#6B4EFF] hover:bg-[#5A3FE7]"
                size="lg"
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}