/** Money is stored in cents everywhere; it is only formatted for display. */
export function formatCurrency(cents: number): string {
  const isWholeDollars = cents % 100 === 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: isWholeDollars ? 0 : 2,
    maximumFractionDigits: isWholeDollars ? 0 : 2,
  }).format(cents / 100);
}

/** Areas are stored in square meters. */
export function formatArea(squareMeters: number): string {
  return `${new Intl.NumberFormat("en-US").format(squareMeters)} m²`;
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}%`;
}
