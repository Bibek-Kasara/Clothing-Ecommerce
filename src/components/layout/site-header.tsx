import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { SearchResults } from '@/components/search/search-results';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItemCount = useWishlistStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/sale', label: 'Sale' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B4EFF] text-white font-bold">
                F
              </div>
              <span className="font-bold text-xl text-slate-800">Fashion</span>
            </Link>
          </div>

          {/* Center: Nav (desktop only) */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'transition-colors duration-200 underline-offset-4 hover:text-[#6B4EFF] hover:underline hover:border-b-2 hover:border-[#6B4EFF] font-medium',
                  location.pathname === link.href ? 'text-[#6B4EFF]' : 'text-slate-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Search (desktop) */}
            <div className="relative hidden md:block w-72 md:w-80">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search for product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
              </form>

              {showSearchResults && debouncedSearchQuery && (
                <SearchResults
                  query={debouncedSearchQuery}
                  onClose={() => setShowSearchResults(false)}
                />
              )}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/dashboard">
                  <Heart className="h-5 w-5 text-[#6B4EFF]" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-[#6B4EFF] text-white rounded-full flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Shopping Cart Icon Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#6B4EFF]"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-[#6B4EFF] text-white rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* Mobile menu button (visible on small screens only) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen((s) => !s)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((s) => !s)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search for product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200"
                  />
                </div>
              </form>

              {/* Mobile Nav */}
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-2 py-2 text-left hover:text-[#6B4EFF] transition-colors duration-200',
                      location.pathname === link.href
                        ? 'text-[#6B4EFF] font-medium'
                        : 'text-slate-700'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-around pt-4 border-t border-slate-200">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" className="relative" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="h-4 w-4 mr-2 text-[#6B4EFF]" />
                    Wishlist
                    {wishlistItemCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#6B4EFF] text-white rounded-full">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-[#6B4EFF]"
                  onClick={() => {
                    openCart();
                    setMobileMenuOpen(false);
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#6B4EFF] text-white rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
