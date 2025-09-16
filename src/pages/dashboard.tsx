import { Link } from 'react-router-dom';
import { User, Heart, Package, MapPin, Settings, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useOrderStore } from '@/store/useOrderStore';

export function DashboardPage() {
  const cartItemCount = useCartStore(state => state.getItemCount());
  const wishlistItemCount = useWishlistStore(state => state.getItemCount());
  const orders = useOrderStore(state => state.orders);

  const recentOrders = orders.slice(0, 3);

  const menuItems = [
    {
      icon: User,
      title: 'Profile Information',
      description: 'Manage your account details and preferences',
      href: '/profile',
      badge: null
    },
    {
      icon: Heart,
      title: 'Wishlist',
      description: 'View and manage your saved items',
      href: '/wishlist',
      badge: wishlistItemCount > 0 ? wishlistItemCount : null
    },
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track your order history and status',
      href: '/orders',
      badge: orders.length > 0 ? orders.length : null
    },
    {
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage your delivery addresses',
      href: '/addresses',
      badge: null
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Account settings and preferences',
      href: '/settings',
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Account</h1>
          <p className="text-slate-600">Manage your account and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cartItemCount}</div>
                <p className="text-xs text-muted-foreground">
                  {cartItemCount > 0 ? 'Items ready for checkout' : 'Your cart is empty'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistItemCount}</div>
                <p className="text-xs text-muted-foreground">
                  {wishlistItemCount > 0 ? 'Saved items' : 'No saved items'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {orders.length > 0 ? 'Order history' : 'No orders yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Management</h2>
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.href} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Link to={item.href} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-[#6B4EFF]/10 rounded-lg">
                          <item.icon className="h-6 w-6 text-[#6B4EFF]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-[#6B4EFF] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="secondary" className="bg-[#6B4EFF]/10 text-[#6B4EFF]">
                            {item.badge}
                          </Badge>
                        )}
                        <div className="w-5 h-5 text-slate-400">→</div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Orders</h2>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-slate-800">
                          {order.id.substring(0, 8)}...
                        </div>
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'shipped' ? 'secondary' :
                            order.status === 'processing' ? 'outline' :
                            'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        NPR {order.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No orders yet</p>
                  <Button asChild>
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}