import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/lib/api';
import { searchAndFilterProducts } from '@/lib/search';
import { toNPR } from '@/lib/currency';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: searchProducts.bind(null, ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchResults = searchAndFilterProducts(allProducts, query).slice(0, 5);

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-4 mt-1">
        <div className="flex justify-center">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-4 mt-1">
        <p className="text-slate-600 text-sm">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto">
      {searchResults.map(product => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          onClick={onClose}
          className="flex items-center p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-lg mr-3"
          />
          <div className="flex-1">
            <p className="font-medium text-sm text-slate-800">{product.title}</p>
            <p className="text-xs text-slate-600">{product.brand}</p>
            <p className="text-sm font-semibold text-[#6B4EFF]">{toNPR(product.price)}</p>
          </div>
        </Link>
      ))}
      
      {searchResults.length > 0 && (
        <Link
          to={`/search?q=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="block p-3 text-center text-[#6B4EFF] font-medium hover:bg-slate-50 transition-colors border-t border-slate-200"
        >
          View all results for "{query}"
        </Link>
      )}
    </div>
  );
}