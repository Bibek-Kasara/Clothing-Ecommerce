export function toNPR(usd: number): string {
  const exchangeRate = Number(import.meta.env.VITE_USD_TO_NPR) || 133;
  const npr = Math.round(usd * exchangeRate);
  return `NPR ${npr.toLocaleString()}`;
}

export function calculateDiscount(originalPrice: number, discountPercentage: number): {
  discountedPrice: number;
  savings: number;
} {
  const savings = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - savings;
  return { discountedPrice, savings };
}