import type { Product } from '@/types/product';

// Search synonyms for better matching
const SEARCH_SYNONYMS: Record<string, string[]> = {
  'shirt': ['mens-shirts', 'tops'],
  'pant': ['pants', 'trousers', 'jeans'],
  'pants': ['pants', 'trousers', 'jeans'],
  'trouser': ['pants', 'trousers', 'jeans'],
  'trousers': ['pants', 'trousers', 'jeans'],
  'one piece': ['womens-dresses', 'dress'],
  'onepiece': ['womens-dresses', 'dress'],
  'kurti': ['womens-dresses', 'tops', 'kurti', 'kurta'],
  'kurta': ['womens-dresses', 'tops', 'kurti', 'kurta'],
  'watch': ['mens-watches', 'womens-watches'],
  'glasses': ['sunglasses'],
  'jewelry': ['womens-jewellery'],
  'jewellery': ['womens-jewellery']
};

export function tokenizeQuery(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(token => token.length > 0);
}

export function expandQueryWithSynonyms(query: string): string[] {
  const tokens = tokenizeQuery(query);
  const expandedTerms = new Set(tokens);

  tokens.forEach(token => {
    const synonyms = SEARCH_SYNONYMS[token];
    if (synonyms) {
      synonyms.forEach(synonym => expandedTerms.add(synonym));
    }
  });

  return Array.from(expandedTerms);
}

export function scoreProductMatch(product: Product, searchTerms: string[]): number {
  let score = 0;
  const searchableText = [
    product.title,
    product.brand,
    product.category,
    product.description
  ].join(' ').toLowerCase();

  searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    
    // Exact matches in title get highest score
    if (product.title.toLowerCase().includes(termLower)) {
      score += 10;
    }
    
    // Brand matches
    if (product.brand.toLowerCase().includes(termLower)) {
      score += 8;
    }
    
    // Category matches
    if (product.category.toLowerCase().includes(termLower)) {
      score += 6;
    }
    
    // Description matches
    if (product.description.toLowerCase().includes(termLower)) {
      score += 2;
    }
    
    // General text matches
    if (searchableText.includes(termLower)) {
      score += 1;
    }
  });

  return score;
}

export function searchAndFilterProducts(
  products: Product[], 
  query: string, 
  minRelevanceScore: number = 1
): Product[] {
  if (!query.trim()) return products;

  const searchTerms = expandQueryWithSynonyms(query);
  
  return products
    .map(product => ({
      product,
      score: scoreProductMatch(product, searchTerms)
    }))
    .filter(({ score }) => score >= minRelevanceScore)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}