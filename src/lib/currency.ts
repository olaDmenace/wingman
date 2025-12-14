/**
 * Currency conversion utilities for Wingman Travel
 * Converts flight prices to Nigerian Naira (NGN)
 */

// Exchange rates (as of common rates - you can update these or use a live API)
const EXCHANGE_RATES: Record<string, number> = {
  'NGN': 1,      // Nigerian Naira (base)
  'USD': 1550,   // US Dollar to NGN
  'EUR': 1680,   // Euro to NGN
  'GBP': 1950,   // British Pound to NGN
  'AED': 422,    // UAE Dirham to NGN
  'ZAR': 82,     // South African Rand to NGN
  'GHS': 125,    // Ghanaian Cedi to NGN
  'KES': 12,     // Kenyan Shilling to NGN
  'EGP': 31,     // Egyptian Pound to NGN
  'TRY': 45,     // Turkish Lira to NGN
  'QAR': 425,    // Qatari Riyal to NGN
  'SAR': 413,    // Saudi Riyal to NGN
  'CAD': 1145,   // Canadian Dollar to NGN
  'AUD': 1020,   // Australian Dollar to NGN
  'CNY': 215,    // Chinese Yuan to NGN
  'JPY': 10.5,   // Japanese Yen to NGN
  'INR': 18.5,   // Indian Rupee to NGN
};

/**
 * Convert a price from any currency to Nigerian Naira
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code (e.g., 'USD', 'EUR')
 * @returns The converted amount in NGN
 */
export function convertToNGN(amount: number, fromCurrency: string): number {
  const currency = fromCurrency.toUpperCase();

  // If already in NGN, return as is
  if (currency === 'NGN') {
    return Math.round(amount);
  }

  // Get exchange rate
  const rate = EXCHANGE_RATES[currency];

  if (!rate) {
    console.warn(`Unknown currency: ${currency}, using USD rate as fallback`);
    return Math.round(amount * EXCHANGE_RATES['USD']);
  }

  return Math.round(amount * rate);
}

/**
 * Format a price in Nigerian Naira with proper formatting
 * @param amount - The amount in NGN
 * @param showSymbol - Whether to include the ₦ symbol (default: true)
 * @returns Formatted price string (e.g., "₦125,000" or "125,000")
 */
export function formatNGN(amount: number, showSymbol: boolean = true): string {
  const formatted = Math.round(amount).toLocaleString('en-NG');
  return showSymbol ? `₦${formatted}` : formatted;
}

/**
 * Convert and format a price to NGN in one step
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency code
 * @returns Formatted price string in NGN (e.g., "₦125,000")
 */
export function convertAndFormatToNGN(amount: number, fromCurrency: string): string {
  const ngnAmount = convertToNGN(amount, fromCurrency);
  return formatNGN(ngnAmount);
}

/**
 * Check if a currency is supported for conversion
 * @param currency - The currency code to check
 * @returns True if the currency is supported
 */
export function isCurrencySupported(currency: string): boolean {
  return currency.toUpperCase() in EXCHANGE_RATES;
}

/**
 * Get all supported currency codes
 * @returns Array of supported currency codes
 */
export function getSupportedCurrencies(): string[] {
  return Object.keys(EXCHANGE_RATES);
}
