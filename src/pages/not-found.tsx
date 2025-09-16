import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NotFoundPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <span className="inline-block rounded-2xl px-3 py-1 text-sm bg-[#6B4EFF]/10 text-[#6B4EFF]">
            404 – Page Not Found
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4">
          Oops, we couldn’t find that page.
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-8">
          The link may be broken or the page might have moved. Try searching for what you need, or use one of the quick links below.
        </p>

        {/* Search */}
        <form onSubmit={onSubmit} className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for product"
              className="pl-10 h-12 text-base bg-slate-50 border-slate-200 focus:bg-white"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#6B4EFF] hover:bg-[#5A3FE7]"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/women">Women’s Wear</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/men">Men’s Wear</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/accessories">Accessories</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/sale">Sale</Link>
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          Need help? <Link to="/contact" className="underline text-[#6B4EFF]">Contact us</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
