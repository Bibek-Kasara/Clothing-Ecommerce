import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Calendar, CreditCard, Truck, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrderStore } from '@/store/useOrderStore';
import { EmptyState } from '@/components/ui/empty-state';
import { toNPR } from '@/lib/currency';
import type { Order } from '@/types/product';

export function OrdersPage() {
  const orders = useOrderStore(state => state.orders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'processing':
        return '⏳';
      case 'pending':
        return '📋';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const handleRemoveItem = (orderId: string, productId: number, size: string) => {
    useOrderStore.getState().removeItemFromOrder(orderId, productId, size);
  };

  const handleRemoveOrder = (orderId: string) => {
    useOrderStore.getState().removeOrder(orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <EmptyState
            icon={Package}
            message="No orders found"
            description="You haven't placed any orders yet. Start shopping to see your orders here."
            action={
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
            <p className="text-slate-600">{orders.length} total orders</p>
          </div>
        </div>

        {/* Order Status Tabs */}
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="all">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({statusCounts.processing})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Shipped ({statusCounts.shipped})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({statusCounts.delivered})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({statusCounts.cancelled})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="mt-6">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No {selectedStatus} orders found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg">
                            <Package className="h-5 w-5 text-[#6B4EFF]" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Order {order.id.substring(0, 8)}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                NPR {order.total.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)} variant="secondary">
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-slate-800">Order Items</h3>
                        {order.items.map((item, index) => {
                          const finalPrice = item.product.onSale
                            ? item.product.price * (1 - item.product.discountPercentage / 100)
                            : item.product.price;

                          return (
                            <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                              <img
                                src={item.product.thumbnail}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800">{item.product.title}</h4>
                                <div className="text-sm text-slate-600 mt-1">
                                  <span>Brand: {item.product.brand}</span>
                                  <span className="mx-2">•</span>
                                  <span>Size: {item.size}</span>
                                  <span className="mx-2">•</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                                <div className="text-lg font-semibold text-[#6B4EFF] mt-2">
                                  {toNPR(finalPrice * item.quantity)}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                color="danger"
                                onClick={() => handleRemoveItem(order.id, item.product.id, item.size)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold text-slate-800">Total Amount:</span>
                          <span className="text-2xl font-bold text-[#6B4EFF]">
                            NPR {order.total.toLocaleString()}
                          </span>
                        </div>

                        {order.status === 'shipped' && (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <Truck className="h-5 w-5" />
                            <span>Your order is on the way!</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <div className="p-4 text-right">
                      <Button
                        variant="outline"
                        color="danger"
                        onClick={() => handleRemoveOrder(order.id)}
                      >
                        Remove Order
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
