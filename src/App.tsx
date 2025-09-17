import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/pages/home';
import { MenPage } from '@/pages/men';
import { WomenPage } from '@/pages/women';
import { AccessoriesPage } from '@/pages/accessories';
import { SalePage } from '@/pages/sale';
import { ProductPage } from '@/pages/product';
import { SearchPage } from '@/pages/search';
import { DashboardPage } from '@/pages/dashboard';
import { OrdersPage } from '@/pages/orders';
import { ContactPage } from '@/pages/contact';
import NotFoundPage from '@/pages/not-found'; // <-- ADD
import { AppErrorBoundary } from '@/components/layout/app-error-boundary'; // <-- ADD
import ScrollToTop from '@/components/scroll-to-top'; // <-- Import the ScrollToTop component
import './index.css';

// Set up react-query client for handling API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          
          {/* ScrollToTop Component to reset scroll on route change */}
          <ScrollToTop />
          
          <main className="flex-1">
            {/* Wrap all routes in the error boundary */}
            <AppErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/men" element={<MenPage />} />
                <Route path="/women" element={<WomenPage />} />
                <Route path="/accessories" element={<AccessoriesPage />} />
                <Route path="/sale" element={<SalePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Catch-all 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppErrorBoundary>
          </main>
          
          <SiteFooter />
          <CartDrawer />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
